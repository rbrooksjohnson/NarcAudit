const mongoose = require('mongoose');

// Physician Sub-Document Schema
const PhysicianSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

// Staff Sub-Document Schema
const StaffSchema = mongoose.Schema({
   name: {
       type: String,
       required: true,
   },
   pin: {
       type: Number,
       required: true
   },
});

// Drug Sub-Document Schema
const DrugSchema = mongoose.Schema({
   name: {
       type: String,
       required: true,
   } ,
   concentration: {
       type: String,
       required: true,
   },
   volume: {
       type: String,
       required: true,
   },
   quantity: {
       type: Number,
       required: true,
   },
   lastUpdated: {
       type: Date,
       required: false,
       default: undefined,
   },
});

// Facility Model
const FacilitySchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    staff: [StaffSchema],
    physicians: [PhysicianSchema],
    drugs: [DrugSchema],
});

const Facility = module.exports = mongoose.model('Facility', FacilitySchema);


// Get All Facilities
module.exports.findAllFacilities = (id, callback) => {
    Facility.find({"ownerId": id}, callback);
};

// Get One Facility
module.exports.findFacility = (id, callback) => {
    Facility.findById(id, callback);
};

// Update Facility
module.exports.updateFacility = (updatedFacility, callback) => {
    Facility.findOneAndUpdate({_id: updatedFacility._id}, {
        $set: {
            _id: updatedFacility._id,
            ownerId: updatedFacility.ownerId,
            name: updatedFacility.name,
            staff: updatedFacility.staff,
            physicians: updatedFacility.physicians,
            drugs: updatedFacility.drugs,
        },
    }, callback);
};

// Create Facility
module.exports.createFacility = (newStubData, callback) => {
    Facility.create(newStubData, callback);
};

// Delete Facility
module.exports.deleteFacility = (facilityId, callback) => {
    Facility.findByIdAndRemove(facilityId, callback);
};

// Admin Get All Facilities
module.exports.adminFindAllFacilities = (callback) => {
    Facility.find({}, callback);
};







