const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const router = express.Router();

const transporter = nodemailer.createTransport({
    host: 'one.mxroute.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'passwords@cglbrokers.com',
        pass: 'mxroutecglbrokerspasswords'
    }
});

// TODO: Add templating to HTML email responses
// See Tutorial: https://www.codementor.io/joshuaaroke/sending-html-message-in-nodejs-express-9i3d3uhjr


// Register
router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        facility: req.body.facility,
        password: req.body.password,
    });

    User.addUser(newUser, (err, callback) => {
        if (err) {
            if (err.code === 11000) {
                res.json({
                    success: false,
                    msg: 'Error: This email address already has an account',
                });
            } else {
                res.json({
                    success: false,
                    msg: 'Error: Please try again later'
                })
            }
        } else {
            const token = jwt.sign({data: callback}, config.secret, {
                expiresIn: 604800, // 1 week
            });
            const mailOptions = {
                from: '"NarcAudit" <passwords@cglbrokers.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'Welcome to NarcAudit', // Subject line
                text: 'Welcome!', // plain text body
                html: '<html><head><title>Welcome Email</title></head><body><div><h3>Dear '+req.body.name+',</h3><p>Welcome to NarcAudit.com!  We are glad you are here! </p><br><p>Thank you!</p><p>NarcAudit.com</p></div></body></html>' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
            res.json({
                success: true,
                msg: 'User registered',
                token: token,
                user: {
                        id: callback._id,
                        name: callback.name,
                        facility: callback.facility,
                        email: callback.email,
                },
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
                msg: 'Error: ' + err,
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
                    msg: 'Error: ' + err,
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
                        facility: user.facility,
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
                facility: req.body.facility,
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


// GET to request a temporary password
//      Takes a QUERY formatted /users/password_reset?email=email@email.com
//      Send password reset email to user with token

router.get('/password_reset', (req, res) => {
    User.issuePasswordResetToken(req.query.email, (err, callback) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Error: Email is not registered',
            })
        } else {
            const mailOptions = {
                from: '"NarcAudit Security" <passwords@cglbrokers.com>', // sender address
                to: req.query.email, // list of receivers
                subject: 'Password Reset', // Subject line
                text: 'Please visit this link: http://localhost:4200/password_reset?token='+callback.password_reset_token, // plain text body
                html: '<html><head><title>Forgot Password Email</title></head><body><div><h3>Dear '+callback.name+',</h3><p>Someone has requested a password reset for your account.  Please use the following <a href="http://localhost:4200/password_reset?token='+callback.password_reset_token+'">link</a> to complete the process.</p><br><p>Thank you!</p><p>NarcAudit.com</p></div></body></html>' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
            res.json({
                success: true,
                msg: 'Success: Please Check Your Email for Link',
            })
        }
    })
});

// POST to initiate a password reset
//      Body must contain:
//          token : (contains temporary token value from email)
//          password : (contains new password, validated on front end)
//      Send password reset confirmation email for security

router.post('/password_reset', (req,res) => {
    console.log(req);
    User.getUserByPasswordResetToken(req.body.token, (err, callback) => {
        if (!err && (callback!=null)) {
            User.resetPassword(callback, req.body.password, (err, callback) => {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'Error: '+err
                    })
                } else {
                    const mailOptions = {
                        from: '"NarcAudit Security" <passwords@cglbrokers.com>', // sender address
                        to: callback.email, // list of receivers
                        subject: 'Your Password Has Changed', // Subject line
                        text: 'Your password has recently been reset. If you did not request this, please log on to NarcAudit.com and update your account immediately', // plain text body
                        html: '<html><head><title>Password Recently Updated</title></head><body><div><h3>Dear '+callback.name+',</h3><p>Your password has recently been reset. If you did not request this, please log on to NarcAudit.com and update your account immediately.</p><br><p>Thank you!</p><p>NarcAudit.com</p></div></body></html>' // html body
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    });
                    res.json({
                        success: true,
                        msg: 'Successfully Reset Password for '+callback.email,
                    })
                }
            })
        } else {
            res.json({
                success: false,
                msg: 'Error: Token Expired'
            })
        }
    })
});

module.exports = router;