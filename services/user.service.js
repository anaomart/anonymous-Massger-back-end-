const userModel = require('../model/user.model');
const { catchAsyncError } = require('../util/catchAsyncError');
const jwt = require('jsonwebtoken')
const validator = require('validator');
const bcrypt = require('bcrypt')
let cloudinary = require('cloudinary');
const sendEmail = require('../util/sendEmail');
cloudinary.config({
    cloud_name: 'dbhxrqn7l',
    api_key: '826488879423284',
    api_secret: '45NTb94cUlFiQaid2rHr31cV3bs'
});
let url = 'http://localhost:4000'

function createToken(_id, expire) {
    return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: expire })
}

module.exports.signup = catchAsyncError(async(req, res) => {
    console.log("sginup")
    const { name, email, password } = req.body;
    try {
        let user = await userModel.signup(name, email, password);
        // sending email 
        let token = createToken(user._id, '5h')
        sendEmail(email, `${url}/user/verify/${token}`, 'Verify Your Email');
        res.status(200).json({ message: "success", name, email });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

module.exports.login = catchAsyncError(async(req, res) => {
    console.log("login")

    const { email, password } = req.body;
    console.log({ email, password })
    try {
        let user = await userModel.login(email, password);
        const token = createToken(user._id, '1d');
        res.status(200).json({ message: "success", token, username: user.name, id: user._id, profileImage: user.profileImage })

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})
module.exports.updateInfo = catchAsyncError(async(req, res) => {
    let { name, email } = req.body;
    let { _id } = req
    if (!validator.isEmail(email)) {
        return res.json({ message: "Invalid Email" })
    }
    let user = await userModel.findByIdAndUpdate(_id, { name, email }, { new: true })

    res.json({ message: "success", user })


})
module.exports.updatePassword = catchAsyncError(async(req, res) => {

    const { oldPassword, newPassword } = req.body;

    let user = await userModel.findById(req._id)

    let match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        console.log("hello", match)
        return res.json({ message: "Wrong Password" })
    }
    if (!validator.isStrongPassword(newPassword)) {
        return res.json({ message: "Not Strong Enough Password" })
    }

    let hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10))

    await userModel.findByIdAndUpdate(req._id, { password: hash })

    res.json({ message: "success", user })
})
module.exports.profileImage = catchAsyncError(async(req, res) => {
    console.log("email: ", req.body.email)

    cloudinary.v2.uploader.upload(req.file.path, async(err, result) => {
        console.log(result)
        req.body.profileImage = result.secure_url;

        let user = await userModel.findOneAndUpdate({ email: req.body.email }, { profileImage: req.body.profileImage })
        console.log({ user })
            // console.log("hello world ", req.file.filename)

        res.json({ message: 'success' })


    })


});
module.exports.verify = catchAsyncError(async(req, res) => {
    console.log("verify route")
    let { token } = req.params

    let decode = jwt.verify(token, process.env.SECRET_KEY)
    let user = await userModel.findByIdAndUpdate(decode._id, { verified: true })

    console.log(decode)
    res.json({ message: 'success' })
})
module.exports.passwordRecoveryEmail = catchAsyncError(async(req, res) => {
    console.log("verify password recovery")
    const { email } = req.body;

    let user = await userModel.findOne({ email });

    let token = createToken(user._id, '5h')

    sendEmail(email, url + '/passwordRecovery/' + token, 'Recover your password')

    res.json({ message: 'Check your Mail' })
})
module.exports.passwordRecoveryEmailVerified = catchAsyncError(async(req, res) => {
    console.log("passwordRecoveryEmailVerified")
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!validator.isStrongPassword(newPassword)) {
        // return res.json({ message: "not Strong Enough Password" })
        throw new Error(" not Strong Enough Password ")
    }
    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    let hash = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

    let user = await userModel.findByIdAndUpdate(decoded._id, { password: hash })


    res.json({ message: 'password updated successfully' })
})
module.exports.getUserName = catchAsyncError(async(req, res) => {
    const { id } = req.params;
    let user = await userModel.findById(id);

    res.json({ username: user.name })
})