const ftp = require('basic-ftp');

class FTPAdapter {
    constructor(config) {
        this.config = config;
    }

    async _getClient() {
        const client = new ftp.Client();
        await client.access(this.config);
        return client;
    }

    async listResources(path = '') {
        const client = await this._getClient();
        const list = await client.list(path);
        client.close();
        return list;
    }

    async deleteResource(path) {
        const client = await this._getClient();
        await client.removeDir(path); // For folder
        await client.remove(path); // For file
        client.close();
    }

    async renameFolder(oldPath, newPath) {
        const client = await this._getClient();
        await client.rename(oldPath, newPath);
        client.close();
    }

    async deleteFile(path) {
        const client = await this._getClient();
        await client.remove(path);
        client.close();
    }

    async downloadFile(path, dest) {
        const client = await this._getClient();
        await client.downloadTo(dest, path);
        client.close();
    }

    async uploadFile(path, file) {
        const client = await this._getClient();
        await client.uploadFrom(file, path);
        client.close();
    }

    async createFolder(path) {
        const client = await this._getClient();
        await client.ensureDir(path);
        client.close();
    }
}

module.exports = FTPAdapter;
