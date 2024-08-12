const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    spec: {
        type: String,
        required: true,
    },
    specvalue: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    rentalRate: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const ItemModel = mongoose.model("Item", ItemSchema);

module.exports = ItemModel;
