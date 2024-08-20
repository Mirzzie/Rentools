// models/rentalModel.js
const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    items: [{
        item_name: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        saleRate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        },
        rentalRate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
    }],
    rentalDate: {
        type: Date,
        default: Date.now,
    },
    returnDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['rented', 'returned'],
        default: 'rented',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const RentalModel = mongoose.model('Rental', RentalSchema);

module.exports = RentalModel;
