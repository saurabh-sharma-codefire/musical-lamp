const express = require("express");
const credController = require('../controllers/creds.controller');
const { isAuth } = require("../middleware/jwt_auth");
const credRouter = express.Router();

// Credential Type CRUD
credRouter.post("/create/credtype", isAuth, credController.createCredentialType);

// ---------- Credentials CRUD -----------------------
// CREATE
credRouter.post("/create", isAuth, credController.createCredential);

// GET ALL (Excluding soft-deleted by default)
credRouter.get("/", isAuth, credController.getAllCredentials);

// GET ALL (Including soft-deleted)
credRouter.get("/all-with-deleted", isAuth, credController.getAllCredentialsWithDeleted);

// GET BY ID (Excluding soft-deleted)
credRouter.get("/:id", isAuth, credController.getCredentialById);

// GET BY ID (Including soft-deleted)
credRouter.get("/with-deleted/:id", isAuth, credController.getCredentialByIdWithDeleted);

// UPDATE
credRouter.put("/:id", isAuth, credController.updateCredential);

// SOFT DELETE
credRouter.delete("/:id", isAuth, credController.deleteCredential);

// HARD DELETE
credRouter.delete("/permanent/:id", isAuth, credController.deleteCredentialPermanently);

module.exports = credRouter;
