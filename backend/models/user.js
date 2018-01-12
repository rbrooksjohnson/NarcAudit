const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  username: {
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
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback)
};

module.exports.getUserByUsername = (username, callback) => {
  const query = {username: username};
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
  console.log(revisedUser);
  User.findOneAndUpdate({_id: revisedUser._id}, {
    $set: {
      name: revisedUser.name,
      email: revisedUser.email,
      username: revisedUser.username,
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
