const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    rentItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
        returnTime: { type: String },  // e.g., "03:45 PM"
    }],
    saleItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
    }],
    orderDate: { type: Date, default: Date.now },  // Auto-assigned order date and time (timestamp)
    returnDate: { type: Date },  // Optional return date
    totalRentAmount: { type: Number, default: 0 },
    totalSaleAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to ensure returnDate is after orderDate
orderSchema.pre('save', function (next) {
    if (this.returnDate) {
        const orderDateTime = this.orderDate;  // Use the automatically assigned timestamp for orderDate
        const returnDateTime = new Date(this.returnDate);

        if (returnDateTime < orderDateTime) {
            return next(new Error('Return date and time must be after order date and time.'));
        }
    }
    next();
});

module.exports = mongoose.model('order', orderSchema);

