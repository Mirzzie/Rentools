// const Rental = require('../models/rentalModel');
// const Item = require('../models/itemModel');



// exports.createRental = async (req, res) => {
//     try {
//         const { name, phone, address, rentalItems, saleItems, returnDate } = req.body;

//         const rentalItemIds = rentalItems.map(item => item._id);
//         const saleItemIds = saleItems.map(item => item._id);

//         const foundRentalItems = await Item.find({ _id: { $in: rentalItemIds } });
//         const foundSaleItems = await Item.find({ _id: { $in: saleItemIds } });

//         if (foundRentalItems.length !== rentalItems.length || foundSaleItems.length !== saleItems.length) {
//             return res.status(404).json({ error: 'Some items not found' });
//         }

//         const totalRentAmount = rentalItems.reduce((total, item) => {
//             const foundItem = foundRentalItems.find(i => i._id.toString() === item._id.toString());
//             return total + ((foundItem?.rentalRate || 0) * item.stock);
//         }, 0);

//         const totalSaleAmount = saleItems.reduce((total, item) => {
//             const foundItem = foundSaleItems.find(i => i._id.toString() === item._id.toString());
//             return total + ((foundItem?.saleRate || 0) * item.stock);
//         }, 0);

//         const rental = new Rental({
//             name,
//             phone,
//             address,
//             rentalItems,
//             saleItems,
//             returnDate,
//             totalRentAmount,
//             totalSaleAmount
//         });

//         await rental.save();
//         res.status(201).json(rental);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.getRentals = async (req, res) => {
//     try {
//         const rentals = await Rental.find({}).populate({
//             path: 'rentalItems._id saleItems._id',
//             select: 'item_name rentalRate saleRate'
//         });
//         res.status(200).json(rentals);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.getRental = async (req, res) => {
//     try {
//         const rental = await Rental.findById(req.params.id).populate({
//             path: 'rentalItems._id saleItems._id',
//             select: 'item_name rentalRate saleRate'
//         });
//         if (!rental) return res.status(404).json({ error: 'Rental not found' });
//         res.json(rental);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.updateRental = async (req, res) => {
//     try {
//         const rental = await Rental.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         ).populate({
//             path: 'rentalItems._id saleItems._id',
//             select: 'item_name rentalRate saleRate'
//         });
//         if (!rental) return res.status(404).json({ error: 'Rental not found' });
//         res.json(rental);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.deleteRental = async (req, res) => {
//     try {
//         const rental = await Rental.findByIdAndDelete(req.params.id);
//         if (!rental) return res.status(404).json({ error: 'Rental not found' });
//         res.json({ message: 'Rental deleted successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

const Rental = require('../models/rentalModel');
const Item = require('../models/itemModel');

exports.createRental = async (req, res) => {
    try {
        const { name, phone, address, rentalItems, saleItems, returnDate } = req.body;



        // Update stock for rental items
        for (let rentalItem of rentalItems) {
            const item = await Item.findById(rentalItem._id);
            if (!item || item.stock < rentalItem.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${item.item_name}` });
            }
            item.stock -= rentalItem.stock; // Decrement stock
            await item.save();
        }

        // Update stock for sale items
        for (let saleItem of saleItems) {
            const item = await Item.findById(saleItem._id);
            if (!item || item.stock < saleItem.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${item.item_name}` });
            }
            item.stock -= saleItem.stock; // Decrement stock
            await item.save();
        }

        const rentalItemIds = rentalItems.map(item => item._id);
        const saleItemIds = saleItems.map(item => item._id);

        const foundRentalItems = await Item.find({ _id: { $in: rentalItemIds } });
        const foundSaleItems = await Item.find({ _id: { $in: saleItemIds } });

        if (foundRentalItems.length !== rentalItems.length || foundSaleItems.length !== saleItems.length) {
            return res.status(404).json({ error: 'Some items not found' });
        }

        const totalRentAmount = rentalItems.reduce((total, item) => {
            const foundItem = foundRentalItems.find(i => i._id.toString() === item._id.toString());
            return total + ((foundItem?.rentalRate || 0) * item.stock);
        }, 0);

        const totalSaleAmount = saleItems.reduce((total, item) => {
            const foundItem = foundSaleItems.find(i => i._id.toString() === item._id.toString());
            return total + ((foundItem?.saleRate || 0) * item.stock);
        }, 0);

        const rental = new Rental({
            name,
            phone,
            address,
            rentalItems,
            saleItems,
            returnDate,
            totalRentAmount,
            totalSaleAmount
        });

        await rental.save();
        res.status(201).json(rental);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({})
            .populate({
                path: 'rentalItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        // Calculate overdue charges
        const updatedRentals = rentals.map(rental => {
            let overdueCharges = 0;

            if (rental.returnDate && new Date() > new Date(rental.returnDate)) {
                const overdueHours = Math.abs(new Date() - new Date(rental.returnDate)) / 36e5; // Hours overdue

                rental.rentalItems.forEach(item => {
                    const rate = item._id.rentalRate;
                    overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
                });
            }

            // Add overdue charges to rental object
            rental = rental.toObject();  // Convert Mongoose document to plain JavaScript object
            rental.overdueCharges = overdueCharges;

            return rental;
        });

        res.status(200).json(updatedRentals);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
            .populate({
                path: 'rentalItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        if (!rental) return res.status(404).json({ error: 'Rental not found' });

        // Calculate overdue charges for the single rental
        let overdueCharges = 0;
        if (rental.returnDate && new Date() > new Date(rental.returnDate)) {
            const overdueHours = Math.abs(new Date() - new Date(rental.returnDate)) / 36e5; // Hours overdue
            rental.rentalItems.forEach(item => {
                const rate = item._id.rentalRate;
                overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
            });
        }

        rental = rental.toObject();  // Convert Mongoose document to plain JavaScript object
        rental.overdueCharges = overdueCharges;

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
        )
            .populate({
                path: 'rentalItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        if (!rental) return res.status(404).json({ error: 'Rental not found' });

        // Calculate overdue charges for the updated rental
        let overdueCharges = 0;
        if (rental.returnDate && new Date() > new Date(rental.returnDate)) {
            const overdueHours = Math.abs(new Date() - new Date(rental.returnDate)) / 36e5; // Hours overdue
            rental.rentalItems.forEach(item => {
                const rate = item._id.rentalRate;
                overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
            });
        }

        rental.overdueCharges = overdueCharges;

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

exports.returnAllItems = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the rental
        const rental = await Rental.findById(id);

        // Check if all rental items are returned
        let allReturned = true;
        for (const item of rental.items) {
            // Attempt to return item and restore stock
            const updatedItem = await Item.findByIdAndUpdate(item._id, { $inc: { stock: item.stock } });

            if (!updatedItem) {
                allReturned = false; // If any item fails to update, mark as not all returned
            }
        }

        if (allReturned) {
            // All items returned, delete rental
            await Rental.findByIdAndDelete(id);
            return res.json({ allReturned: true, message: 'All items returned and rental removed.' });
        } else {
            // Update the rental to reflect only pending items
            rental.items = rental.items.filter(item => item.stock > 0); // Keep only pending items
            await rental.save();
            return res.json({ allReturned: false, message: 'Returned available items. Pending items are still in the rental.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error returning all items.' });
    }
};
