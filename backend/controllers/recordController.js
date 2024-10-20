const Record = require('../models/recordModel');
const Item = require('../models/itemModel');
// Get all records
exports.getRecords = async (req, res) => {
    try {
        const records = await Record.find().sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records' });
    }
};

// Create a new record
exports.createRecord = async (req, res) => { // Change function name to avoid confusion
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Error deleting record' });
    }
};


exports.getAllRecords = async (req, res) => {
    try {
        const records = await Item.find()
            .populate({
                path: 'rentItems._id',
                select: 'item_name description', // Populate item_name and description
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description', // Populate item_name and description
            });
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Error fetching records' });
    }
};