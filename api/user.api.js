const auth = require('../middleware/auth');
const { signup, login, updateInfo, updatePassword, profileImage, verify, passwordRecoveryEmail, passwordRecoveryEmailVerified, getUserName } = require('../services/user.service');
const { uploadFile } = require('../util/FileUpload');

const app = require('express').Router();


app.post('/signup', uploadFile('image'), signup)
app.post('/login', login)
app.put('/update', auth, updateInfo)
app.put('/updatePassword', auth, updatePassword)
app.post('/profileImage', uploadFile('image'), profileImage)
app.get('/verify/:token', verify)
app.post('/passwordRecovery', passwordRecoveryEmail)
app.post('/passwordRecovery/:token', passwordRecoveryEmailVerified)
app.get('/userName/:id', getUserName)
module.exports = app