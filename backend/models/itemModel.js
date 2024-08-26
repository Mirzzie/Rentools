const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Ensuring category is required
    description: { type: String },
    rentalRate: { type: Number, required: true }, // Rental price per unit
    saleRate: { type: Number, required: true }, // Sale price per unit
    quantity: { type: Number, required: true, min: 0 }, // Non-negative quantity
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
