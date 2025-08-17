const s3Adapter = require('./s3Adapter');
const ftpAdapter = require('./ftpAdapter');

class FolderAdapter {
    constructor(type, config) {
        if (type === 'aws-s3') this.adapter = new s3Adapter(config);
        else if (type === 'ftp') this.adapter = new ftpAdapter(config);
        else throw new Error('Unsupported adapter type');
    }

    listResources(path) { return this.adapter.listResources(path); }
    deleteResource(path) { return this.adapter.deleteResource(path); }
    renameFolder(oldPath, newPath) { return this.adapter.renameFolder(oldPath, newPath); }
    deleteFile(path) { return this.adapter.deleteFile(path); }
    downloadFile(path, dest) { return this.adapter.downloadFile(path, dest); }
    uploadFile(path, file) { return this.adapter.uploadFile(path, file); }
    createFolder(path) { return this.adapter.createFolder(path); }
}

module.exports = FolderAdapter;
