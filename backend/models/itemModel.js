const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    spec: { type: String, required: true },
    specvalue: { type: Number, required: true },
    unit: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rentalRate: { type: Number, required: true },
    saleRate: { type: Number, required: true } // Added saleRate field
});

module.exports = mongoose.model('Item', itemSchema);
