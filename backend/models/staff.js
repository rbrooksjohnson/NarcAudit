const mongoose = require('mongoose');

// Staff Model
const StaffSchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: false,
    },
    secretPin: {
        type: Number,
        required: true,
    },
});

const Staff = module.exports = mongoose.model('Staff', StaffSchema);


// Get All Staffs
module.exports.findAllStaffs = (id, callback) => {
    Staff.find({"ownerId": id}, callback);
};

// Get One Staff
module.exports.findStaff = (id, callback) => {
    Staff.findById(id, callback);
};

// Update Staff
module.exports.updateStaff = (updatedStaff, callback) => {
    Staff.findOneAndUpdate({_id: updatedStaff._id}, {
        $set: {
            _id: updatedStaff._id,
            ownerId: updatedStaff.ownerId,
            name: updatedStaff.name,
            nickname: updatedStaff.nickname,
            secretPin: updatedStaff.secretPin
        },
    }, callback);
};

// Create Staff
module.exports.createStaff = (newStubData, callback) => {
    Staff.create(newStubData, callback);
};

// Delete Staff
module.exports.deleteStaff = (staffId, callback) => {
    Staff.findByIdAndRemove(staffId, callback);
};

// Admin Get All Staffs
module.exports.adminFindAllStaffs = (callback) => {
    Staff.find({}, callback);
};







