const AWS = require('aws-sdk');

class S3Adapter {
    constructor(config) {
        this.s3 = new AWS.S3({
            accessKeyId: config.access_key,
            secretAccessKey: config.secret_key,
            region: config.region
        });
        this.bucket = config.bucket;
    }

    async listResources(path = '') {
        // List folders and files in S3
        const params = {
            Bucket: this.bucket,
            Prefix: path,
            Delimiter: '/'
        };
        return this.s3.listObjectsV2(params).promise();
    }

    async deleteResource(path) {
        // For S3: delete file or all files within a 'folder' (prefix)
        return this.s3.deleteObject({ Bucket: this.bucket, Key: path }).promise();
    }

    async renameFolder(oldPath, newPath) {
        // S3 does not support direct rename; you'd need to copy then delete.
        throw new Error("Not implemented for S3: renameFolder");
    }

    async deleteFile(path) {
        return this.deleteResource(path);
    }

    async downloadFile(path, dest) {
        // Download logic
        return this.s3.getObject({ Bucket: this.bucket, Key: path }).promise();
    }

    async uploadFile(path, file) {
        // file: Buffer or ReadStream
        return this.s3.upload({ Bucket: this.bucket, Key: path, Body: file }).promise();
    }

    async createFolder(path) {
        // In S3, folders are prefixes—create a dummy object to simulate a folder.
        return this.s3.putObject({ Bucket: this.bucket, Key: path + '/', Body: '' }).promise();
    }
}

module.exports = S3Adapter;
