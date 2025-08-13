const mongoose = require('mongoose');

const fileOperationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CloudAdapter',
    required: true
  },
  operation: {
    type: String,
    required: true,
    enum: ['upload', 'download', 'delete', 'list', 'create_folder', 'update']
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
fileOperationSchema.index({ userId: 1, createdAt: -1 });
fileOperationSchema.index({ adapterId: 1, createdAt: -1 });

module.exports = mongoose.model('FileOperation', fileOperationSchema);