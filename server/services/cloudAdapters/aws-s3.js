const AWS = require('aws-sdk');

class AWSS3Adapter {
  constructor(credentials) {
    this.s3 = new AWS.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      region: credentials.region || 'us-east-1'
    });
    this.bucketName = credentials.bucketName;
  }

  async listFiles(prefix = '') {
    try {
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix,
        Delimiter: '/'
      };

      const data = await this.s3.listObjectsV2(params).promise();
      
      const folders = data.CommonPrefixes?.map(prefix => ({
        name: prefix.Prefix.replace(params.Prefix, '').replace('/', ''),
        type: 'folder',
        path: prefix.Prefix,
        size: 0,
        lastModified: null
      })) || [];

      const files = data.Contents?.map(object => ({
        name: object.Key.replace(params.Prefix, ''),
        type: 'file',
        path: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
        etag: object.ETag
      })).filter(file => file.name !== '') || [];

      return {
        folders,
        files,
        totalCount: folders.length + files.length
      };
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  async uploadFile(filePath, fileBuffer, options = {}) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: filePath,
        Body: fileBuffer,
        ContentType: options.contentType || 'application/octet-stream',
        Metadata: options.metadata || {}
      };

      if (options.acl) {
        params.ACL = options.acl;
      }

      const result = await this.s3.upload(params).promise();
      
      return {
        success: true,
        location: result.Location,
        etag: result.ETag,
        key: result.Key
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async downloadFile(filePath) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: filePath
      };

      const data = await this.s3.getObject(params).promise();
      
      return {
        buffer: data.Body,
        contentType: data.ContentType,
        contentLength: data.ContentLength,
        lastModified: data.LastModified,
        etag: data.ETag,
        metadata: data.Metadata
      };
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new Error('File not found');
      }
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async deleteFile(filePath) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: filePath
      };

      await this.s3.deleteObject(params).promise();
      
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  async createFolder(folderPath) {
    try {
      // S3 doesn't have folders, but we can create an empty object with trailing slash
      const params = {
        Bucket: this.bucketName,
        Key: folderPath.endsWith('/') ? folderPath : folderPath + '/',
        Body: '',
        ContentType: 'application/x-directory'
      };

      await this.s3.putObject(params).promise();
      
      return {
        success: true,
        message: 'Folder created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create folder: ${error.message}`);
    }
  }

  async getFileInfo(filePath) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: filePath
      };

      const data = await this.s3.headObject(params).promise();
      
      return {
        name: filePath.split('/').pop(),
        path: filePath,
        size: data.ContentLength,
        contentType: data.ContentType,
        lastModified: data.LastModified,
        etag: data.ETag,
        metadata: data.Metadata
      };
    } catch (error) {
      if (error.code === 'NotFound') {
        throw new Error('File not found');
      }
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  async copyFile(sourcePath, destinationPath) {
    try {
      const params = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourcePath}`,
        Key: destinationPath
      };

      await this.s3.copyObject(params).promise();
      
      return {
        success: true,
        message: 'File copied successfully'
      };
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
  }

  async moveFile(sourcePath, destinationPath) {
    try {
      // Copy file to new location
      await this.copyFile(sourcePath, destinationPath);
      
      // Delete original file
      await this.deleteFile(sourcePath);
      
      return {
        success: true,
        message: 'File moved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }
}

module.exports = AWSS3Adapter;