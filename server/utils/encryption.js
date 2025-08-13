const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';

if (secretKey.length !== 32) {
  throw new Error('Encryption key must be exactly 32 characters long');
}

const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, secretKey);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

const decrypt = (encryptedData) => {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipher(algorithm, secretKey);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

module.exports = {
  encrypt,
  decrypt,
  hashPassword
};