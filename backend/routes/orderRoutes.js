// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.get('/', orderController.getOrders);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

// Route to get all orders (with sale and order items)
router.get('/getAllOrders', orderController.getAllOrders);

module.exports = router;
