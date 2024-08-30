const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    rentalItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
        returnTime: { type: String },  // e.g., "03:45 PM"
    }],
    saleItems: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        stock: { type: Number, required: true },
    }],
    rentalDate: { type: Date, default: Date.now },  // Auto-assigned rental date and time (timestamp)
    returnDate: { type: Date },  // Optional return date
    totalRentAmount: { type: Number, default: 0 },
    totalSaleAmount: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to ensure returnDate is after rentalDate
rentalSchema.pre('save', function (next) {
    if (this.returnDate) {
        const rentalDateTime = this.rentalDate;  // Use the automatically assigned timestamp for rentalDate
        const returnDateTime = new Date(this.returnDate);

        if (returnDateTime < rentalDateTime) {
            return next(new Error('Return date and time must be after rental date and time.'));
        }
    }
    next();
});

module.exports = mongoose.model('Rental', rentalSchema);

