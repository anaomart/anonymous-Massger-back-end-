const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const validator = require('validator')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    }
})

userSchema.statics.signup = async function(name, email, password) {
    if (!email || !password || !name) {
        throw Error("All Fields Must Be Failed")
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough");
    }
    const emailExits = await this.findOne({ email });
    if (emailExits) {
        throw Error("User Already  Exists");
    }

    let hash = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const user = await this.create({ email, password: hash, name });

    return user;
}
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("All Failed Must Be Filled ")
    }
    let user = await this.findOne({ email });
    if (!user) {
        throw Error("User Not Found ");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect password")
    }
    if (!user.verified) {
        throw Error("Please Verify your Email First")
    }
    return user;



}


module.exports = mongoose.model('anonymous_massager_user', userSchema)