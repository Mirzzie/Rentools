const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    description: { type: String },
    rentalRate: { type: Number }, // Rental price per unit
    saleRate: { type: Number }, // Sale price per unit
    stock: { type: Number, required: true, min: 0 }, // Non-negative quantity
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
