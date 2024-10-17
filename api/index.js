const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require("cors");
const path = require('path');

const connectDB = require('./config/db');
const databaseSeeder = require("./databaseSeeder");
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");
const cartRoute = require("./routes/Cart");

const port = process.env.PORT || 5001;

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: '*' }));

// API Routes
app.use("/api/seed", databaseSeeder);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);

// PayPal API Key Route
app.get("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
});

// Static Files
app.use(express.static(path.resolve(__dirname, '../client/dist')));

// Catch-All Route for React
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = app;
