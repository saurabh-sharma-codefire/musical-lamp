const express = require('express');
const { body, validationResult } = require('express-validator');
const CloudAdapter = require('../models/CloudAdapter');
const AdapterFactory = require('../services/adapterFactory');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all adapters for the current user
router.get('/', auth, async (req, res) => {
  try {
    const adapters = await CloudAdapter.find({ userId: req.user._id })
      .select('-credentials')
      .sort({ createdAt: -1 });

    res.json({
      adapters,
      count: adapters.length
    });
  } catch (error) {
    console.error('Get adapters error:', error);
    res.status(500).json({ error: 'Server error fetching adapters' });
  }
});

// Get supported adapter types
router.get('/types', (req, res) => {
  try {
    const supportedTypes = AdapterFactory.getSupportedTypes();
    res.json({ supportedTypes });
  } catch (error) {
    console.error('Get adapter types error:', error);
    res.status(500).json({ error: 'Server error fetching adapter types' });
  }
});

// Create new adapter
router.post('/', [
  auth,
  body('name')
    .notEmpty()
    .trim()
    .withMessage('Adapter name is required'),
  body('type')
    .isIn(['aws-s3', 'ftp', 'google-cloud', 'azure-blob'])
    .withMessage('Invalid adapter type'),
  body('credentials')
    .isObject()
    .withMessage('Credentials must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, type, credentials, config = {}, isDefault = false } = req.body;

    // Validate credentials for the adapter type
    try {
      AdapterFactory.validateCredentials(type, credentials);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Test the adapter connection
    try {
      const adapter = AdapterFactory.createAdapter(type, credentials);
      // For AWS S3, try to list objects to test connection
      if (type === 'aws-s3') {
        await adapter.listFiles('');
      }
    } catch (connectionError) {
      return res.status(400).json({ 
        error: 'Failed to connect with provided credentials',
        details: connectionError.message
      });
    }

    // Check if adapter name already exists for this user
    const existingAdapter = await CloudAdapter.findOne({
      userId: req.user._id,
      name
    });

    if (existingAdapter) {
      return res.status(400).json({ 
        error: 'Adapter with this name already exists' 
      });
    }

    // Create new adapter
    const adapter = new CloudAdapter({
      userId: req.user._id,
      name,
      type,
      credentials,
      config,
      isDefault
    });

    await adapter.save();

    // Return adapter without credentials
    const responseAdapter = adapter.toObject();
    delete responseAdapter.credentials;

    res.status(201).json({
      message: 'Adapter created successfully',
      adapter: responseAdapter
    });
  } catch (error) {
    console.error('Create adapter error:', error);
    res.status(500).json({ error: 'Server error creating adapter' });
  }
});

// Get specific adapter
router.get('/:id', auth, async (req, res) => {
  try {
    const adapter = await CloudAdapter.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('-credentials');

    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    res.json({ adapter });
  } catch (error) {
    console.error('Get adapter error:', error);
    res.status(500).json({ error: 'Server error fetching adapter' });
  }
});

// Update adapter
router.put('/:id', [
  auth,
  body('name')
    .optional()
    .notEmpty()
    .trim()
    .withMessage('Adapter name cannot be empty'),
  body('credentials')
    .optional()
    .isObject()
    .withMessage('Credentials must be an object'),
  body('config')
    .optional()
    .isObject()
    .withMessage('Config must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { name, credentials, config, isDefault } = req.body;

    const adapter = await CloudAdapter.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    // Check if new name already exists (excluding current adapter)
    if (name && name !== adapter.name) {
      const existingAdapter = await CloudAdapter.findOne({
        userId: req.user._id,
        name,
        _id: { $ne: adapter._id }
      });

      if (existingAdapter) {
        return res.status(400).json({ 
          error: 'Adapter with this name already exists' 
        });
      }
    }

    // If updating credentials, validate and test them
    if (credentials) {
      try {
        AdapterFactory.validateCredentials(adapter.type, credentials);
        
        // Test the connection
        const testAdapter = AdapterFactory.createAdapter(adapter.type, credentials);
        if (adapter.type === 'aws-s3') {
          await testAdapter.listFiles('');
        }
      } catch (validationError) {
        return res.status(400).json({ 
          error: 'Invalid credentials',
          details: validationError.message
        });
      }
    }

    // Update adapter
    const updateData = {};
    if (name) updateData.name = name;
    if (credentials) updateData.credentials = credentials;
    if (config) updateData.config = config;
    if (typeof isDefault === 'boolean') updateData.isDefault = isDefault;

    const updatedAdapter = await CloudAdapter.findByIdAndUpdate(
      adapter._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-credentials');

    res.json({
      message: 'Adapter updated successfully',
      adapter: updatedAdapter
    });
  } catch (error) {
    console.error('Update adapter error:', error);
    res.status(500).json({ error: 'Server error updating adapter' });
  }
});

// Delete adapter
router.delete('/:id', auth, async (req, res) => {
  try {
    const adapter = await CloudAdapter.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    await CloudAdapter.findByIdAndDelete(adapter._id);

    res.json({ message: 'Adapter deleted successfully' });
  } catch (error) {
    console.error('Delete adapter error:', error);
    res.status(500).json({ error: 'Server error deleting adapter' });
  }
});

// Test adapter connection
router.post('/:id/test', auth, async (req, res) => {
  try {
    const adapter = await CloudAdapter.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    // Get decrypted credentials and test connection
    const credentials = adapter.getDecryptedCredentials();
    const cloudAdapter = AdapterFactory.createAdapter(adapter.type, credentials);
    
    // Test connection based on adapter type
    let testResult;
    if (adapter.type === 'aws-s3') {
      testResult = await cloudAdapter.listFiles('');
    }

    res.json({
      message: 'Connection test successful',
      connected: true,
      testResult: {
        type: adapter.type,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Test adapter error:', error);
    res.status(400).json({ 
      error: 'Connection test failed',
      connected: false,
      details: error.message
    });
  }
});

// Set adapter as default
router.post('/:id/set-default', auth, async (req, res) => {
  try {
    const adapter = await CloudAdapter.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!adapter) {
      return res.status(404).json({ error: 'Adapter not found' });
    }

    // Remove default flag from other adapters of the same type
    await CloudAdapter.updateMany(
      { 
        userId: req.user._id, 
        type: adapter.type,
        _id: { $ne: adapter._id }
      },
      { isDefault: false }
    );

    // Set this adapter as default
    adapter.isDefault = true;
    await adapter.save();

    res.json({ 
      message: 'Adapter set as default successfully',
      adapter: {
        id: adapter._id,
        name: adapter.name,
        type: adapter.type,
        isDefault: adapter.isDefault
      }
    });
  } catch (error) {
    console.error('Set default adapter error:', error);
    res.status(500).json({ error: 'Server error setting default adapter' });
  }
});

module.exports = router;