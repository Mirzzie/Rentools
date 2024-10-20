const Order = require('../models/orderModel');
const Item = require('../models/itemModel');
const Record = require('../models/recordModel');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { name, phone, address, rentItems, saleItems, returnDate } = req.body;

        // Update stock for rental items
        for (let rentItem of rentItems) {
            const item = await Item.findById(rentItem._id);
            if (!item || item.stock < rentItem.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${item ? item.item_name : 'item'}` });
            }
            item.stock -= rentItem.stock; // Decrement stock for rental items
            await item.save();
        }

        // Update stock for sale items
        for (let saleItem of saleItems) {
            const item = await Item.findById(saleItem._id);
            if (!item || item.stock < saleItem.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${item ? item.item_name : 'item'}` });
            }
            item.stock -= saleItem.stock; // Decrement stock for sale items
            await item.save();
        }

        const rentItemIds = rentItems.map(item => item._id);
        const saleItemIds = saleItems.map(item => item._id);

        const foundRentItems = await Item.find({ _id: { $in: rentItemIds } });
        const foundSaleItems = await Item.find({ _id: { $in: saleItemIds } });

        if (foundRentItems.length !== rentItems.length || foundSaleItems.length !== saleItems.length) {
            return res.status(404).json({ error: 'Some items not found' });
        }

        const totalRentAmount = rentItems.reduce((total, item) => {
            const foundItem = foundRentItems.find(i => i._id.toString() === item._id.toString());
            return total + ((foundItem?.rentalRate || 0) * item.stock);
        }, 0);

        const totalSaleAmount = saleItems.reduce((total, item) => {
            const foundItem = foundSaleItems.find(i => i._id.toString() === item._id.toString());
            return total + ((foundItem?.saleRate || 0) * item.stock);
        }, 0);

        const order = new Order({
            name,
            phone,
            address,
            rentItems,
            saleItems,
            orderDate: new Date(), // Automatically set with current date/time
            returnDate,
            totalRentAmount,
            totalSaleAmount
        });


        await order.save();



        // Also save the order to the Record collection
        const record = new Record({
            name,
            phone,
            address,
            rentItems,
            saleItems,
            orderDate: new Date(),
            returnDate,
            totalRentAmount,
            totalSaleAmount
        });

        await record.save(); // Save the record for record-keeping

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all orders with item details and calculate overdue charges
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate({
                path: 'rentItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        // Calculate overdue charges
        const updatedOrders = orders.map(order => {
            let overdueCharges = 0;

            if (order.returnDate && new Date() > new Date(order.returnDate)) {
                const overdueHours = Math.abs(new Date() - new Date(order.returnDate)) / 36e5; // Hours overdue

                order.rentItems.forEach(item => {
                    const rate = item._id.rentalRate;
                    overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
                });
            }

            // Add overdue charges to order object
            order = order.toObject();  // Convert Mongoose document to plain JavaScript object
            order.overdueCharges = overdueCharges;

            return order;
        });

        res.status(200).json(updatedOrders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all orders (without overdue calculation)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('rentItems._id saleItems._id');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Retrieve a single order with item details and calculate overdue charges
exports.getOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id)
            .populate({
                path: 'rentItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Calculate overdue charges for the single order
        let overdueCharges = 0;
        if (order.returnDate && new Date() > new Date(order.returnDate)) {
            const overdueHours = Math.abs(new Date() - new Date(order.returnDate)) / 36e5; // Hours overdue
            order.rentItems.forEach(item => {
                const rate = item._id.rentalRate;
                overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
            });
        }

        order = order.toObject();  // Convert Mongoose document to plain JavaScript object
        order.overdueCharges = overdueCharges;

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        let order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate({
                path: 'rentItems._id',
                select: 'item_name description rentalRate'
            })
            .populate({
                path: 'saleItems._id',
                select: 'item_name description saleRate'
            });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Calculate overdue charges for the updated order
        let overdueCharges = 0;
        if (order.returnDate && new Date() > new Date(order.returnDate)) {
            const overdueHours = Math.abs(new Date() - new Date(order.returnDate)) / 36e5; // Hours overdue
            order.rentItems.forEach(item => {
                const rate = item._id.rentalRate;
                overdueCharges += rate * overdueHours * item.stock; // Calculate charge based on rate, time, and stock
            });
        }

        order.overdueCharges = overdueCharges;

        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Return all items in an order and update stock
exports.returnAllItems = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the order
        const order = await Order.findById(id);

        // Check if all rent items are returned
        let allReturned = true;
        for (const item of order.rentItems) {
            // Attempt to return item and restore stock
            const updatedItem = await Item.findByIdAndUpdate(item._id, { $inc: { stock: item.stock } });

            if (!updatedItem) {
                allReturned = false; // If any item fails to update, mark as not all returned
            }
        }

        if (allReturned) {
            // All items returned, delete order
            await Order.findByIdAndDelete(id);
            return res.json({ allReturned: true, message: 'All items returned and order removed.' });
        } else {
            // Update the order to reflect only pending items
            order.rentItems = order.rentItems.filter(item => item.stock > 0); // Keep only pending items
            await order.save();
            return res.json({ allReturned: false, message: 'Returned available items. Pending items are still in the order.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error returning all items.' });
    }
};
