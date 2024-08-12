const Item = require('../models/itemModel');

exports.createItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

exports.getItemsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const items = await Item.find({ category: categoryId }).populate('category');
        res.status(200).json(items);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find({}).populate('category');
        res.status(200).json(items);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

exports.getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};
