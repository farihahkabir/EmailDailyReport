const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: True
    },
    password: {
        type: String,
        required: True
    }
});

const User = mongoose.model('User',UserSchema);
module.exports = User;