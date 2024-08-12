// models/categoryModel.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    type: {
        type: String,
        required: true,
    },
    description: String,
}, { timestamps: true });

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
