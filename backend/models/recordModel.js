const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    rentItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
        returnTime: { type: String },
    }],
    saleItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
    }],
    orderDate: { type: Date, default: Date.now },
    returnDate: { type: Date },
    totalRentAmount: { type: Number, default: 0 },
    totalSaleAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
