const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    User.addUser(newUser, (err) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register user',
            })
        } else {
            res.json({
                success: true,
                msg: 'User registered',
            })
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.json({
                success: false,
                msg: 'Error: '+err,
            })
        }
        if (!user) {
            return res.json({
                success: false,
                msg: 'Email Address Not Found',
            })
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                return res.json({
                    success: false,
                    msg: 'Error: '+err,
                })
            }
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800, // 1 week
                });

                res.json({
                    success: true,
                    msg: 'Successfully Logged On',
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                    },
                })
            } else {
                return res.json({
                    success: false,
                    msg: 'Incorrect password',
                })
            }
        })
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({user: req.user})
    });

// Administration List Users
router.get('/admin', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const decoded = jwt.decode(req.get('jwt'));
        if (decoded.data.superuser === 'true') {
            User.getAllUsers((err, users) => {
                if (err) {
                    throw err
                }
                if (!users) {
                    return res.json({
                        success: false,
                        msg: 'Users not found',
                    })
                }
                if (users) {
                    return res.json(users)
                }
            })
        } else {
            return res.json({
                success: false,
                msg: 'Unauthorized',
            })
        }
    });

// Administration Delete User
router.delete('/admin/delete', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const decoded = jwt.decode(req.get('jwt'));
        if (decoded.data.superuser === 'true') {
            User.deleteUserById(req.headers._id, (err, callback) => {
                if (err) {
                    console.log(err)
                }
                if (!callback) {
                    return res.json({success: false, msg: 'User not found',})
                }
                if (callback) {
                    return res.json({success: true, message: 'User Deleted',})
                }
            })
        } else {
            return res.json({
                success: false,
                msg: 'Unauthorized',
            })
        }
    });

// Administration Get Full User Info
router.get('/admin/user', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const decoded = jwt.decode(req.get('jwt'));
        if (decoded.data.superuser === 'true') {
            User.getUserById(req.headers._id, (err, callback) => {
                if (err) {
                    console.log(err)
                }
                if (!callback) {
                    return res.json({success: false, msg: 'User not found',})
                }
                if (callback) {
                    return res.json(callback)
                }
            })
        } else {
            return res.json({
                success: false,
                msg: 'Unauthorized',
            })
        }
    });

// Administration Update User
router.put('/admin/user', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const decoded = jwt.decode(req.get('jwt'));
        if (decoded.data.superuser === 'true') {
            let revisedUser = new User({
                _id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                superuser: req.body.superuser,
            });
            User.updateById(revisedUser,
                (err, callback) => {
                    if (err) {
                        console.log(err)
                    }
                    if (!callback) {
                        return res.json({success: false, msg: 'User not found'})
                    }
                    if (callback) {
                        return res.json({success: true, msg: 'User updated'})
                    }
                })
        } else {
            return res.json({success: false, msg: 'Unauthorized'})
        }
    });

module.exports = router;