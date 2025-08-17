const models = require("../models/index");
const CommonService = require("../services/CommonService");

// ---------------- Credential Type ----------------
exports.createCredentialType = async (req, res) => {
  try {
    let userID = req?.user?.id;
    const { type, label, metadata } = req?.body;
    const response = await models.credtypes.create({ createdBy: userID, updatedBy: userID, type, label, metadata })
    return res.REST.SUCCESS(1, "Credential created Successfully", response);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
}

exports.getCredentialTypeList = async (req, res) => {
  try {
    const credTypes = await models.credtypes.findAll();
    return res.REST.SUCCESS(1, "Fetched credential types successfully", credTypes);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

// ----------------- Credentials ----------------
exports.createCredential = async (req, res) => {
  try {
    let userID = req?.user?.id;
    console.log("Req User", req?.user)
    const { credtype, metadata } = req?.body;
    const isEncrypted = false; // Make it Encrypted Later
    const response = await models.credentials.create({ userId: userID, credType: credtype, metadata, isEncrypted, createdBy: userID, updatedBy: userID })
    return res.REST.SUCCESS(1, "Credential created Successfully", response);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

// Soft delete
exports.deleteCredential = async (req, res) => {
  try {
    const id = req.params.id;
    await models.credentials.destroy({ where: { id } }); // Soft delete (sets deletedAt)
    return res.REST.SUCCESS(1, "Credential deleted (soft) successfully");
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

// Hard delete
exports.deleteCredentialPermanently = async (req, res) => {
  try {
    const id = req.params.id;
    await models.credentials.destroy({ where: { id }, force: true }); // True delete from DB
    return res.REST.SUCCESS(1, "Credential deleted permanently");
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

exports.getAllCredentials = async (req, res) => {
  try {
    const userID = req?.user?.id;
    const credentials = await models.credentials.findAll({ where: { userId: userID } }); // excludes soft deleted
    return res.REST.SUCCESS(1, "Fetched credentials successfully", credentials);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

exports.getAllCredentialsWithDeleted = async (req, res) => {
  try {
    const userID = req?.user?.id;
    const credentials = await models.credentials.findAll({ where: { userId: userID }, paranoid: false }); // includes soft deleted
    return res.REST.SUCCESS(1, "Fetched all credentials (including deleted)", credentials);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

exports.getCredentialById = async (req, res) => {
  try {
    const id = req.params.id;
    const credential = await models.credentials.findByPk(id); // excludes soft deleted by default
    return res.REST.SUCCESS(1, "Fetched credential successfully", credential);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

// Including deleted
exports.getCredentialByIdWithDeleted = async (req, res) => {
  try {
    const id = req.params.id;
    const credential = await models.credentials.findByPk(id, { paranoid: false });
    return res.REST.SUCCESS(1, "Fetched credential (including deleted)", credential);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};

exports.updateCredential = async (req, res) => {
  try {
    const id = req.params.id;
    const { credtype, metadata } = req.body;
    const updatedBy = req?.user?.id;
    const [updatedRows] = await models.credentials.update(
      { credType: credtype, metadata, updatedBy },
      { where: { id } }
    );
    if (updatedRows === 0) {
      return res.REST.ERROR("No credential found to update");
    }
    const updatedCredential = await models.credentials.findByPk(id);
    return res.REST.SUCCESS(1, "Credential updated successfully", updatedCredential);
  } catch (error) {
    CommonService.filterError(error, req, res);
  }
};
