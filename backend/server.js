require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');


const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderViewRoutes = require('./routes/orderViewRoutes');



app.use(cors());
app.use(express.json());

const db_uri = process.env.MONGO_URI;
const PORT = process.env.PORT;

mongoose.connect(db_uri, {
    tlsAllowInvalidCertificates: true,
}).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderViewRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: err.message });
});

let cart = [];

app.post('/cart', (req, res) => {
    const { item } = req.body;
    cart.push(item);
    res.status(200).send(cart);
  });
  
  app.get('/cart', (req, res) => {
    res.status(200).send(cart);
  });
  