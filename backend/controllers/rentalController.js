const Rental = require('../models/rentalModel');
const Item = require('../models/itemModel');

exports.createRental = async (req, res) => {
    try {
        const { name, phone, address, items, returnDate } = req.body;

        const itemIds = items.map(item => item._id);
        const rentalItems = await Item.find({ _id: { $in: itemIds } });

        if (rentalItems.length !== items.length) {
            return res.status(404).json({ error: 'Some items not found' });
        }

        const rental = new Rental({
            name,
            phone,
            address,
            items,
            returnDate,
            totalRentAmount: items.reduce((total, item) => {
                const foundItem = rentalItems.find(i => i._id.toString() === item._id.toString());
                return total + ((foundItem?.rentalRate || 0) * item.quantity);
            }, 0),
            totalSaleAmount: items.reduce((total, item) => {
                const foundItem = rentalItems.find(i => i._id.toString() === item._id.toString());
                return total + ((foundItem?.saleRate || 0) * item.quantity);
            }, 0)
        });

        await rental.save();
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({}).populate({
            path: 'items._id',
            select: 'item_name rentalRate saleRate'
        });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id).populate({
            path: 'items._id',
            select: 'item_name rentalRate saleRate'
        });
        if (!rental) return res.status(404).json({ error: 'Rental not found' });
        res.json(rental);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateRental = async (req, res) => {
    try {
        const rental = await Rental.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate({
            path: 'items._id',
            select: 'item_name rentalRate saleRate'
        });
        if (!rental) return res.status(404).json({ error: 'Rental not found' });
        res.json(rental);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRental = async (req, res) => {
    try {
        const rental = await Rental.findByIdAndDelete(req.params.id);
        if (!rental) return res.status(404).json({ error: 'Rental not found' });
        res.json({ message: 'Rental deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
