const models = require("../models");
const FolderService = require("../services/folderService"); // per previous answer
const CommonService = require("../services/CommonService");

async function getCredentialMetadata(id) {
    const credential = await models.credentials.findByPk(id, { include: [{ association: "credentialType" }] });
    if (!credential) throw new Error("Credential not found");
    return { metadata: credential.metadata, type: credential.credentialType.type }; // Contains config for adapter
}

// List resources (optionally in a folder)
exports.listResources = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path = "" } = req.query;
        const { type, metadata } = await getCredentialMetadata(credentialId);
        console.log("Credential", type, metadata)
        const folderService = new FolderService(type, metadata); // e.g., type = 's3' or 'ftp'
        const resources = await folderService.listResources(path);
        return res.REST.SUCCESS(1, "Resources listed", resources);
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.deleteResource = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path } = req.body;
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        await folderService.deleteResource(path);
        return res.REST.SUCCESS(1, "Resource deleted");
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.renameFolder = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { oldPath, newPath } = req.body;
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        await folderService.renameFolder(oldPath, newPath);
        return res.REST.SUCCESS(1, "Folder renamed");
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path } = req.body;
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        await folderService.deleteFile(path);
        return res.REST.SUCCESS(1, "File deleted");
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.downloadFile = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path } = req.query;
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        const fileStream = await folderService.downloadFile(path);
        fileStream.pipe(res); // pipe fileStream to response
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.uploadFile = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path } = req.body;
        const file = req.file; // Assuming express-fileupload or multer
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        await folderService.uploadFile(path, file);
        return res.REST.SUCCESS(1, "File uploaded");
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};

exports.createFolder = async (req, res) => {
    try {
        const { credentialId } = req.params;
        const { path } = req.body;
        const metadata = await getCredentialMetadata(credentialId);
        const folderService = new FolderService(metadata.type, metadata);
        await folderService.createFolder(path);
        return res.REST.SUCCESS(1, "Folder created");
    } catch (error) {
        CommonService.filterError(error, req, res);
    }
};
