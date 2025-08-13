const AWSS3Adapter = require('./cloudAdapters/aws-s3');

class AdapterFactory {
  static createAdapter(type, credentials) {
    switch (type) {
      case 'aws-s3':
        return new AWSS3Adapter(credentials);
      case 'ftp':
        // TODO: Implement FTP adapter
        throw new Error('FTP adapter not implemented yet');
      case 'google-cloud':
        // TODO: Implement Google Cloud adapter
        throw new Error('Google Cloud adapter not implemented yet');
      case 'azure-blob':
        // TODO: Implement Azure Blob adapter
        throw new Error('Azure Blob adapter not implemented yet');
      default:
        throw new Error(`Unsupported adapter type: ${type}`);
    }
  }

  static getSupportedTypes() {
    return [
      {
        type: 'aws-s3',
        name: 'Amazon S3',
        description: 'Amazon Simple Storage Service',
        implemented: true,
        requiredCredentials: ['accessKeyId', 'secretAccessKey', 'bucketName', 'region']
      },
      {
        type: 'ftp',
        name: 'FTP Server',
        description: 'File Transfer Protocol',
        implemented: false,
        requiredCredentials: ['host', 'port', 'username', 'password']
      },
      {
        type: 'google-cloud',
        name: 'Google Cloud Storage',
        description: 'Google Cloud Platform Storage',
        implemented: false,
        requiredCredentials: ['projectId', 'keyFilename', 'bucketName']
      },
      {
        type: 'azure-blob',
        name: 'Azure Blob Storage',
        description: 'Microsoft Azure Blob Storage',
        implemented: false,
        requiredCredentials: ['accountName', 'accountKey', 'containerName']
      }
    ];
  }

  static validateCredentials(type, credentials) {
    const supportedTypes = this.getSupportedTypes();
    const adapterType = supportedTypes.find(t => t.type === type);
    
    if (!adapterType) {
      throw new Error(`Unsupported adapter type: ${type}`);
    }

    const missingCredentials = adapterType.requiredCredentials.filter(
      field => !credentials[field]
    );

    if (missingCredentials.length > 0) {
      throw new Error(`Missing required credentials: ${missingCredentials.join(', ')}`);
    }

    return true;
  }
}

module.exports = AdapterFactory;