const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const Drug = require('../models/drug');
const router = express.Router();

/*
                  API Definition
             (project/routes/drugs.js)
         all routes require authentication

  [tested] Retrieve all drugs = GET to /drugs
            (Admins will get all drugs of all users)

  [tested] Retrieve one drug = GET to /drugs/drug_id
            (Admins will get any requested drug)

  [tested] Update one drug = PUT to /drugs/drug_id
            (Admins can update any drug)
             - only updated fields need to be passed in body

  [tested] Delete one drug = DELETE to /drugs/drug_id
            (Admins can delete any drug)

  [tested] Create new drug = POST to /drugs

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

        Drug.findDrug(req.params.id, (err, databaseObject) => {

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

                    // Establish temporary Drug from the http message
                    // Iterate through all model elements and take update if available from request

                    let newDrug = Drug({
                        _id: databaseObject._id,
                        ownerId: req.body.ownerId || databaseObject.ownerId,
                        name: req.body.name || databaseObject.name,
                        volume: req.body.volume || databaseObject.volume,
                        concentration: req.body.concentration || databaseObject.concentration,
                        quantity: req.body.quantity || databaseObject.quantity,
                        onTray: req.body.onTray || databaseObject.onTray
                    });

                    Drug.updateDrug(newDrug, (err, callback) => {

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

        Drug.findDrug(req.params.id, (err, databaseObject) => {

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
            Drug.adminFindAllDrugs((err, databaseObjects) => {

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
            Drug.findAllDrugs(userId, (err, databaseObjects) => {

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

        Drug.findDrug(req.params.id, (err, databaseObject) => {

            // Error Checks

            if (err) {
                return res.json({success: false, msg: 'Error: ' + err});
            }
            if (!databaseObject) {
                return res.json({success: false, msg: 'Error: Drug Does Not Exist'});
            }

            // Confirm model is owned by requestor

            if (databaseObject) {
                if (databaseObject.ownerId === userId || superuser === 'true') {

                    // Delete Object

                    Drug.deleteDrug(req.params.id, (err, callback) => {
                        if (err) {
                            return res.json({success: false, msg: 'Error: ' + err});
                        }
                        if (!callback) {
                            return res.json({success: false, msg: 'Error: Drug Not Found'});
                        }
                        if (callback) {
                            return res.json({success: true, msg: 'Success: Drug was successfully deleted'});
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

        let newDrug = Drug({
            ownerId: userId,
            name: req.body.name || 'No Name',
            volume: req.body.volume || 0,
            concentration: req.body.concentration || 0,
        });

        Drug.createDrug(newDrug, (err, callback) => {

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

