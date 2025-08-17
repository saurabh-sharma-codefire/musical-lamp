const api = require('express')();
const UserRouter = require('./user.route');
const AuthRouter = require('./auth.route');
const UploadFile = require('./upload.route');
const notifyRouter = require('./notification.route');
const featureRouter = require('./features.route');
const credRouter = require('./creds.route');
const folderRouter = require('./folders.route');
const { isAuth } = require('../middleware/jwt_auth');

api.get("/", (req, res) => {
    res.send('Hello Node Server🌎 is Working Fine here...');
})
api.use('/user', UserRouter);
api.use('/auth', AuthRouter);
api.use('/upload', UploadFile);
api.use('/notification', notifyRouter);
api.use('/feature', featureRouter);
api.use('/creds', credRouter);
api.use('/folders', isAuth, folderRouter);


module.exports = api