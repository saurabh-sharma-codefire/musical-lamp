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
    transformS3ListToCommonArray(s3ListResponse) {
        const { Contents = [], CommonPrefixes = [] } = s3ListResponse;
        const folders = CommonPrefixes.map(prefixObj => ({
            type: 'folder',
            name: prefixObj.Prefix,  // Full prefix (folder path)
            key: prefixObj.Prefix,
            size: 0,
            lastModified: null,
        }));

        const files = Contents
            .filter(item => !item.Key.endsWith('/'))  // filter out folder-like entries (optional, if folders stored as empty keys)
            .map(item => ({
                type: 'file',
                name: item.Key,
                key: item.Key,
                size: item.Size,
                lastModified: item.LastModified,
                etag: item.ETag,
                storageClass: item.StorageClass,
            }));

        return [...folders, ...files];
    }

}

module.exports = FolderService;
