const express = require("express");
const folderRouter = express.Router();
const folderController = require("../controllers/folders.controller");

// List resources in root or folder
folderRouter.get("/:credentialId/list", folderController.listResources);

// Delete resource (folder or file)
folderRouter.delete("/:credentialId", folderController.deleteResource);

// Rename folder
folderRouter.put("/:credentialId/rename", folderController.renameFolder);

// Delete file
folderRouter.delete("/:credentialId/file", folderController.deleteFile);

// Download file
folderRouter.get("/:credentialId/download", folderController.downloadFile);

// Upload file
folderRouter.post("/:credentialId/upload", folderController.uploadFile);

// Create folder
folderRouter.post("/:credentialId/create-folder", folderController.createFolder);

module.exports = folderRouter;
