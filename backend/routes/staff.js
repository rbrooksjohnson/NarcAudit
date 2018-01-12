const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Staff = require('../models/staff');
const router = express.Router();

/*
                  API Definition
             (project/routes/staffs.js)
         all routes require authentication

  [tested] Retrieve all staffs = GET to /staffs
            (Admins will get all staffs of all users)

  [tested] Retrieve one staff = GET to /staffs/staff_id
            (Admins will get any requested staff)

  [tested] Update one staff = PUT to /staffs/staff_id
            (Admins can update any staff)
             - only updated fields need to be passed in body

  [tested] Delete one staff = DELETE to /staffs/staff_id
            (Admins can delete any staff)

  [tested] Create new staff = POST to /staffs

*/

// -----------------------------------------------------------------------------
// PUT single object

router.put('/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        // Extract UserID from Token as 'userID'

        const decoded = jwt.decode(req.get('jwt'));
        const userId = decoded.data._id;
        const superuser = decoded.data.superuser;

        // Extract ObjectId from requested object

        Staff.findStaff(req.params.id, (err, databaseObject) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (!databaseObject) {
                return res.json({success: false, msg: 'Error: Unable to determine model owner'});
            }

            // Confirm model is owned by requestor

            if (databaseObject) {
                if (databaseObject.ownerId === userId || superuser === 'true') {

                    // Establish temporary Staff from the http message
                    // Iterate through all model elements and take update if available from request

                    let newStaff = Staff({
                        _id: databaseObject._id,
                        ownerId: req.body.ownerId || databaseObject.ownerId,
                        name: req.body.name || databaseObject.name,
                        nickname: req.body.nickname || databaseObject.nickname,
                        secretPin: req.body.secretPin || databaseObject.secretPin,
                    });

                    Staff.updateStaff(newStaff, (err, callback) => {

                        // Error Checks

                        if (err) {
                            console.log(err);
                            return res.json({success: false, msg: 'Error: ' + err});
                        }
                        if (!callback) {
                            return res.json({success: false, msg: 'Error: Model unable to be updated'});
                        }

                        // Successful Update

                        if (callback) {
                            return res.json({success: true, msg: 'Success: Model successfully updated'});
                        }
                    });

                    // If model isn't owned by requestor

                } else {
                    return res.json({success: false, msg: 'Error: You are not authorized to access this object'});
                }
            }
        });
    });

// -----------------------------------------------------------------------------
// GET single object

router.get('/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        // Extract UserID from Token as 'userID'

        const decoded = jwt.decode(req.get('jwt'));
        const userId = decoded.data._id;
        const superuser = decoded.data.superuser;

        // Extract ObjectId from requested object

        Staff.findStaff(req.params.id, (err, databaseObject) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (!databaseObject) {
                return res.json({success: false, msg: 'Error: Unable to determine model owner'});
            }

            if (databaseObject) {
                if (databaseObject.ownerId === userId || superuser === 'true') {

                    return res.json(databaseObject);

                } else {
                    return res.json({success: false, msg: 'Error: You are not authorized to access this object'});
                }
            }
        });
    });

// -----------------------------------------------------------------------------
// GET all owned objects

router.get('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        // Extract UserID from Token as 'userID'

        const decoded = jwt.decode(req.get('jwt'));
        const userId = decoded.data._id;
        const superuser = decoded.data.superuser;

        if (superuser === 'true') {
            Staff.adminFindAllStaffs((err, databaseObjects) => {

                if (err) {
                    return res.json({success: false, msg: 'Error: ' + err});
                }
                if (!databaseObjects) {
                    return res.json({success: false, msg: 'Error: No Owned Objects Found'});
                }
                if (databaseObjects) {
                    return res.json(databaseObjects);
                }
            });
        } else {
            Staff.findAllStaffs(userId, (err, databaseObjects) => {

                // Error Checks

                if (err) {
                    return res.json({success: false, msg: 'Error: ' + err});
                }
                if (!databaseObjects) {
                    return res.json({success: false, msg: 'Error: No Owned Objects Found'});
                }
                else {
                    return res.json(databaseObjects);
                }
            });
        }
    });

// -----------------------------------------------------------------------------
// DELETE object

router.delete('/:id', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        // Extract UserID from Token as 'userID'

        const decoded = jwt.decode(req.get('jwt'));
        const userId = decoded.data._id;
        const superuser = decoded.data.superuser;

        // Extract ObjectId from requested object

        Staff.findStaff(req.params.id, (err, databaseObject) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (!databaseObject) {
                return res.json({success: false, msg: 'Error: Staff Does Not Exist'});
            }

            // Confirm model is owned by requestor

            if (databaseObject) {
                if (databaseObject.ownerId === userId || superuser === 'true') {

                    // Delete Object

                    Staff.deleteStaff(req.params.id, (err, callback) => {
                        if (err) {
                            return res.json({success: false, msg: 'Error: ' + err});
                        }
                        if (!callback) {
                            return res.json({success: false, msg: 'Error: Staff Not Found'});
                        }
                        if (callback) {
                            return res.json({success: true, msg: 'Success: Staff was successfully deleted'});
                        }
                    });

                    // If model isn't owned by requestor

                } else {
                    return res.json({success: false, msg: 'Error: You are not authorized to access this object'});
                }
            }
        });
    });

// -----------------------------------------------------------------------------
// POST object

router.post('/', passport.authenticate('jwt', {session: false}),
    (req, res) => {

        // Extract ObjectId from requested object

        const decoded = jwt.decode(req.get('jwt'));
        const userId = decoded.data._id;

        let newStaff = Staff({
            ownerId: userId,
            name: req.body.name || 'No Name',
            nickname: req.body.nickname || req.body.name || 'No Nickname',
            secretPin: req.body.secretPin || 9999,
        });

        Staff.createStaff(newStaff, (err, callback) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (callback) {
                return res.json({success: true, msg: 'Success: New model created'});
            }
            else {
                return res.json({success: false, msg: 'Error: Something went wrong'});
            }
        });
    });



module.exports = router;

