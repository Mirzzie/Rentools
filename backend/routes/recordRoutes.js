const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

// Get all records
router.get('/', recordController.getRecords);

// Create a new record
router.post('/', recordController.createRecord); // Make sure to call the correct function
router.delete('/:id', recordController.deleteRecord);
module.exports = router;
