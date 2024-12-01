require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Import route files
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderViewRoutes = require('./routes/orderViewRoutes');
const recordRoutes = require('./routes/recordRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const db_uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(db_uri, {
    tlsAllowInvalidCertificates: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderViewRoutes);
app.use('/api/records', recordRoutes);

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, 'public')));

// Handle React routing, return all other requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
});

// Export the app to be used by Electron's main process
module.exports = app;
