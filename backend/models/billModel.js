// models/billModel.js
const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true,
    },
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rental',
        required: true,
    },
    generatedDate: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
    },
}, { timestamps: true });

const BillModel = mongoose.model('Bill', BillSchema);

module.exports = BillModel;
