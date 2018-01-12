const mongoose = require('mongoose');

// Drug Model
const DrugSchema = mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    volume: {
        type: String,
        required: true,
    },
    concentration: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
        required: false,
    },
    onTray: {
        type: Number,
        default: 0,
        required: false,
    },
});

const Drug = module.exports = mongoose.model('Drug', DrugSchema);


// Get All Drugs
module.exports.findAllDrugs = (id, callback) => {
    Drug.find({"ownerId": id}, callback);
};

// Get One Drug
module.exports.findDrug = (id, callback) => {
    Drug.findById(id, callback);
};

// Update Drug
module.exports.updateDrug = (updatedDrug, callback) => {
    Drug.findOneAndUpdate({_id: updatedDrug._id}, {
        $set: {
            _id: updatedDrug._id,
            ownerId: updatedDrug.ownerId,
            name: updatedDrug.name,
            volume: updatedDrug.volume,
            concentration: updatedDrug.concentration,
            quantity: updatedDrug.quantity,
            onTray: updatedDrug.onTray,
        },
    }, callback);
};

// Create Drug
module.exports.createDrug = (newStubData, callback) => {
    Drug.create(newStubData, callback);
};

// Delete Drug
module.exports.deleteDrug = (drugId, callback) => {
    Drug.findByIdAndRemove(drugId, callback);
};

// Admin Get All Drugs
module.exports.adminFindAllDrugs = (callback) => {
    Drug.find({}, callback);
};







