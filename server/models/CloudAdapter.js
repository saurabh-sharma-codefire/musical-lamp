const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const cloudAdapterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['aws-s3', 'ftp', 'google-cloud', 'azure-blob']
  },
  credentials: {
    type: String, // Encrypted JSON string
    required: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt credentials before saving
cloudAdapterSchema.pre('save', function(next) {
  if (this.isModified('credentials') && typeof this.credentials === 'object') {
    this.credentials = encrypt(JSON.stringify(this.credentials));
  }
  next();
});

// Decrypt credentials when retrieving
cloudAdapterSchema.methods.getDecryptedCredentials = function() {
  try {
    const decrypted = decrypt(this.credentials);
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt credentials');
  }
};

// Ensure only one default adapter per user per type
cloudAdapterSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { 
        userId: this.userId, 
        type: this.type, 
        _id: { $ne: this._id } 
      },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('CloudAdapter', cloudAdapterSchema);