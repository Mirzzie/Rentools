// routes/rentalRoutes.js
const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.post('/', rentalController.createRental);
router.get('/:id', rentalController.getRental);
router.get('/', rentalController.getRentals);
router.put('/:id/return-all', rentalController.returnAllItems);
router.put('/:id', rentalController.updateRental);
router.delete('/:id', rentalController.deleteRental);

module.exports = router;
