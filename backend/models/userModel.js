const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel;