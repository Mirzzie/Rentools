// controllers/billController.js
const Bill = require('../models/billModel');
const Rental = require('../models/rentalModel');

exports.createBill = async (req, res) => {
    try {
        const { customerId, rentalId, amount } = req.body;

        const customer = await Rental.findById(customerId);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const rental = await Rental.findById(rentalId);
        if (!rental) return res.status(404).json({ error: 'Rental not found' });

        const bill = new Bill({
            customer: customerId,
            rental: rentalId,
            amount,
        });

        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate('customer rental');
        if (!bill) return res.status(404).json({ error: 'Bill not found' });
        res.json(bill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customer rental');
        if (!bill) return res.status(404).json({ error: 'Bill not found' });
        res.json(bill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);
        if (!bill) return res.status(404).json({ error: 'Bill not found' });
        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
