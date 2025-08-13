const express = require('express');
const multer = require('multer');
const { body, query, validationResult } = require('express-validator');
const CloudAdapter = require('../models/CloudAdapter');
const FileOperation = require('../models/FileOperation');
const User = require('../models/User');
const AdapterFactory = require('../services/adapterFactory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,txt,zip').split(',');
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    }
  }
});

// Helper function to get adapter
const getAdapter = async (adapterId, userId) => {
  const adapterDoc = await CloudAdapter.findOne({
    _id: adapterId,
    userId: userId
  });

  if (!adapterDoc) {
    throw new Error('Adapter not found');
  }

  const credentials = adapterDoc.getDecryptedCredentials();
  return AdapterFactory.createAdapter(adapterDoc.type, credentials);
};

// Helper function to log file operation
const logFileOperation = async (userId, adapterId, operation, filePath, fileName, fileSize, status, errorMessage = null) => {
  try {
    const fileOp = new FileOperation({
      userId,
      adapterId,
      operation,
      filePath,
      fileName,
      fileSize,
      status,
      errorMessage
    });
    await fileOp.save();
  } catch (error) {
    console.error('Error logging file operation:', error);
  }
};

// List files and folders
router.get('/list/:adapterId', [
  auth,
  query('path')
    .optional()
    .isString()
    .withMessage('Path must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { path = '' } = req.query;

    const adapter = await getAdapter(adapterId, req.user._id);
    const result = await adapter.listFiles(path);

    await logFileOperation(req.user._id, adapterId, 'list', path, null, null, 'success');

    res.json({
      path,
      ...result
    });
  } catch (error) {
    console.error('List files error:', error);
    await logFileOperation(req.user._id, req.params.adapterId, 'list', req.query.path || '', null, null, 'failed', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Upload file
router.post('/upload/:adapterId', [
  auth,
  upload.single('file'),
  body('path')
    .optional()
    .isString()
    .withMessage('Path must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { adapterId } = req.params;
    const { path = '' } = req.body;

    // Check user storage limit
    const user = await User.findById(req.user._id);
    if (user.storageUsed + req.file.size > user.storageLimit) {
      return res.status(400).json({ 
        error: 'Storage limit exceeded',
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        fileSize: req.file.size
      });
    }

    const adapter = await getAdapter(adapterId, req.user._id);
    
    const filePath = path ? `${path}/${req.file.originalname}` : req.file.originalname;
    
    const result = await adapter.uploadFile(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        originalName: req.file.originalname,
        uploadedBy: req.user._id.toString(),
        uploadedAt: new Date().toISOString()
      }
    });

    // Update user storage usage
    user.storageUsed += req.file.size;
    await user.save();

    await logFileOperation(
      req.user._id, 
      adapterId, 
      'upload', 
      filePath, 
      req.file.originalname, 
      req.file.size, 
      'success'
    );

    res.json({
      message: 'File uploaded successfully',
      file: {
        name: req.file.originalname,
        path: filePath,
        size: req.file.size,
        type: req.file.mimetype
      },
      result
    });
  } catch (error) {
    console.error('Upload file error:', error);
    await logFileOperation(
      req.user._id, 
      req.params.adapterId, 
      'upload', 
      req.body.path || '', 
      req.file?.originalname, 
      req.file?.size, 
      'failed', 
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/download/:adapterId', [
  auth,
  query('path')
    .notEmpty()
    .withMessage('File path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { path } = req.query;

    const adapter = await getAdapter(adapterId, req.user._id);
    const fileData = await adapter.downloadFile(path);

    await logFileOperation(req.user._id, adapterId, 'download', path, path.split('/').pop(), null, 'success');

    // Set appropriate headers
    res.set({
      'Content-Type': fileData.contentType || 'application/octet-stream',
      'Content-Length': fileData.contentLength,
      'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`
    });

    res.send(fileData.buffer);
  } catch (error) {
    console.error('Download file error:', error);
    await logFileOperation(req.user._id, req.params.adapterId, 'download', req.query.path, null, null, 'failed', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/delete/:adapterId', [
  auth,
  body('path')
    .notEmpty()
    .withMessage('File path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { path } = req.body;

    const adapter = await getAdapter(adapterId, req.user._id);
    
    // Get file info to update storage usage
    let fileSize = 0;
    try {
      const fileInfo = await adapter.getFileInfo(path);
      fileSize = fileInfo.size || 0;
    } catch (error) {
      // File might not exist, continue with deletion attempt
    }

    const result = await adapter.deleteFile(path);

    // Update user storage usage
    if (fileSize > 0) {
      const user = await User.findById(req.user._id);
      user.storageUsed = Math.max(0, user.storageUsed - fileSize);
      await user.save();
    }

    await logFileOperation(req.user._id, adapterId, 'delete', path, path.split('/').pop(), fileSize, 'success');

    res.json({
      message: 'File deleted successfully',
      path,
      result
    });
  } catch (error) {
    console.error('Delete file error:', error);
    await logFileOperation(req.user._id, req.params.adapterId, 'delete', req.body.path, null, null, 'failed', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create folder
router.post('/folder/:adapterId', [
  auth,
  body('path')
    .notEmpty()
    .withMessage('Folder path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { path } = req.body;

    const adapter = await getAdapter(adapterId, req.user._id);
    const result = await adapter.createFolder(path);

    await logFileOperation(req.user._id, adapterId, 'create_folder', path, null, null, 'success');

    res.json({
      message: 'Folder created successfully',
      path,
      result
    });
  } catch (error) {
    console.error('Create folder error:', error);
    await logFileOperation(req.user._id, req.params.adapterId, 'create_folder', req.body.path, null, null, 'failed', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get file info
router.get('/info/:adapterId', [
  auth,
  query('path')
    .notEmpty()
    .withMessage('File path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { path } = req.query;

    const adapter = await getAdapter(adapterId, req.user._id);
    const fileInfo = await adapter.getFileInfo(path);

    res.json({
      fileInfo
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Copy file
router.post('/copy/:adapterId', [
  auth,
  body('sourcePath')
    .notEmpty()
    .withMessage('Source path is required'),
  body('destinationPath')
    .notEmpty()
    .withMessage('Destination path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { sourcePath, destinationPath } = req.body;

    const adapter = await getAdapter(adapterId, req.user._id);
    const result = await adapter.copyFile(sourcePath, destinationPath);

    res.json({
      message: 'File copied successfully',
      sourcePath,
      destinationPath,
      result
    });
  } catch (error) {
    console.error('Copy file error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Move file
router.post('/move/:adapterId', [
  auth,
  body('sourcePath')
    .notEmpty()
    .withMessage('Source path is required'),
  body('destinationPath')
    .notEmpty()
    .withMessage('Destination path is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { adapterId } = req.params;
    const { sourcePath, destinationPath } = req.body;

    const adapter = await getAdapter(adapterId, req.user._id);
    const result = await adapter.moveFile(sourcePath, destinationPath);

    await logFileOperation(req.user._id, adapterId, 'update', `${sourcePath} -> ${destinationPath}`, null, null, 'success');

    res.json({
      message: 'File moved successfully',
      sourcePath,
      destinationPath,
      result
    });
  } catch (error) {
    console.error('Move file error:', error);
    await logFileOperation(req.user._id, req.params.adapterId, 'update', `${req.body.sourcePath} -> ${req.body.destinationPath}`, null, null, 'failed', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get file operations history
router.get('/operations', [
  auth,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const operations = await FileOperation.find({ userId: req.user._id })
      .populate('adapterId', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await FileOperation.countDocuments({ userId: req.user._id });

    res.json({
      operations,
      pagination: {
        limit,
        offset,
        totalCount,
        hasMore: offset + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Get operations error:', error);
    res.status(500).json({ error: 'Server error fetching operations' });
  }
});

module.exports = router;