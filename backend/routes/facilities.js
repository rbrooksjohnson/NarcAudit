const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Facility = require('../models/facility');
const router = express.Router();

/*
                  API Definition
             (project/routes/facilities.js)
         all routes require authentication

  [tested] Retrieve facilities = GET to /facilities
            (Users will only get their facility)
            (Admins will get all facility names and UIDs of all users)

  [tested] Retrieve any one facility = GET to /facilities/facility_id
            (---Admin only---)

  [tested] Update one facility = PUT to /facilities/facility_id
            (Admins can update any facility)
             - only updated fields need to be passed in body

  [tested] Delete one facility = DELETE to /facilities/facility_id
            (---Admin only---)

  [tested] Create new facility = POST to /facilities
            (---Admin only---)
            (Users have a shell facility generated when signing-up)

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

        Facility.findFacility(req.params.id, (err, databaseObject) => {

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

                    // Establish temporary Facility from the http message
                    // Iterate through all model elements and take update if available from request

                    let newFacility = Facility({
                        _id: databaseObject._id,
                        ownerId: req.body.ownerId || databaseObject.ownerId,
                        name: req.body.name || databaseObject.name,
                        nickname: req.body.nickname || databaseObject.nickname,
                        secretPin: req.body.secretPin || databaseObject.secretPin,
                    });

                    Facility.updateFacility(newFacility, (err, callback) => {

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

        Facility.findFacility(req.params.id, (err, databaseObject) => {

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
            Facility.adminFindAllFacilities((err, databaseObjects) => {

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
            Facility.findAllFacilities(userId, (err, databaseObjects) => {

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

        Facility.findFacility(req.params.id, (err, databaseObject) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (!databaseObject) {
                return res.json({success: false, msg: 'Error: Facility Does Not Exist'});
            }

            // Confirm model is owned by requestor

            if (databaseObject) {
                if (databaseObject.ownerId === userId || superuser === 'true') {

                    // Delete Object

                    Facility.deleteFacility(req.params.id, (err, callback) => {
                        if (err) {
                            return res.json({success: false, msg: 'Error: ' + err});
                        }
                        if (!callback) {
                            return res.json({success: false, msg: 'Error: Facility Not Found'});
                        }
                        if (callback) {
                            return res.json({success: true, msg: 'Success: Facility was successfully deleted'});
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

        let newFacility = Facility({
            ownerId: userId,
            name: req.body.name || 'No Name',
            nickname: req.body.nickname || req.body.name || 'No Nickname',
            secretPin: req.body.secretPin || 9999,
        });

        Facility.createFacility(newFacility, (err, callback) => {

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

