const FolderAdapter = require('../adapters/folderAdapter');

class FolderService {
    constructor(storageType, config) {
        this.adapter = new FolderAdapter(storageType, config);
    }

    listResources(path) { return this.adapter.listResources(path); }
    deleteResource(path) { return this.adapter.deleteResource(path); }
    renameFolder(oldPath, newPath) { return this.adapter.renameFolder(oldPath, newPath); }
    deleteFile(path) { return this.adapter.deleteFile(path); }
    downloadFile(path, dest) { return this.adapter.downloadFile(path, dest); }
    uploadFile(path, file) { return this.adapter.uploadFile(path, file); }
    createFolder(path) { return this.adapter.createFolder(path); }
}

module.exports = FolderService;
