const express = require('express');
const router = express.Router();
const orderViewController = require('../controllers/orderViewController');

// Retrieve all orders with rental and sales details
router.get('/orders', orderViewController.getOrders);

// Acknowledge the return of a specific rental item and update stock
router.post('/return/:orderId/:itemId', orderViewController.acknowledgeReturn);

module.exports = router;
