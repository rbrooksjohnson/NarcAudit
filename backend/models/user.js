const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    facility: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    superuser: {
        type: String,
        default: false,
        required: true,
    },
    password_reset_token: {
        type: String,
        required: false
    },
    password_reset_token_expiration: {
        type: Number,
        required: false,
    },
    admin_pin: {
        type: String,
        required: false,
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback)
};

module.exports.getUserByUsername = (facility, callback) => {
    const query = {facility: facility};
    User.findOne(query, callback)
};

module.exports.getUserByEmail = (email, callback) => {
    const query = {email: email};
    User.findOne(query, callback)
};

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};

module.exports.updateById = (revisedUser, callback) => {
    User.findOneAndUpdate({_id: revisedUser._id}, {
        $set: {
            name: revisedUser.name,
            email: revisedUser.email,
            facility: revisedUser.facility,
            superuser: revisedUser.superuser,
        },
    }, callback)
};

module.exports.getAllUsers = (callback) => {
    User.find({}, callback)
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            throw err;
        }
        callback(null, isMatch)
    })
};

module.exports.deleteUserById = (id, callback) => {
    User.findByIdAndRemove(id, callback)
};

module.exports.getUserByEmail = (email, callback) => {
    const query = {email: email};
    User.findOne(query, callback)
};

module.exports.getUserByPasswordResetToken = (token, callback) => {
    const query = {
        password_reset_token: token,
        password_reset_token_expiration: {$gt: Date.now()}
    };
    User.findOne(query, callback)
};

// Generates and stores to user document:
//      Temporary 256 bit hex string token for password reset use
//      Expiration date/time that is 1 hour in the future

module.exports.issuePasswordResetToken = (email, callback) => {
    crypto.randomBytes(32, (err, buffer) => {
        const token = buffer.toString('hex');
        const expiration = Date.now() + 3600000;
        const query = {'email': email};
        User.findOneAndUpdate(query, {
            $set: {
                password_reset_token: token,
                password_reset_token_expiration: expiration,
            }
        }, {new: true}, callback)
    })
};

// Take in a user and new password
//      Store salted and hashed password
//      Set any password reset data elements to undefined

module.exports.resetPassword = (user, newPassword, callback) => {
    user.password = bcrypt.hashSync(newPassword, 10);
    user.password_reset_token = undefined;
    user.password_reset_token_expiration = undefined;
    user.save(callback)
};


