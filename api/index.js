const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const cors = require("cors")


const products = require('./data/products')

const connectDB = require('./config/db')


const port= process.env.PORT || 5001

connectDB()

const app = express()

const databaseSeeder = require("./databaseSeeder");
const userRoute = require("./routes/User");
const productRoute = require("./routes/Product");
const orderRoute = require("./routes/Order");


app.use(express.json())

app.use(cors({
  origin: '*'
}));

//database seeder routes
app.use("/api/seed", databaseSeeder);

//routes for users
app.use("/api/users", userRoute);

//routes for products
app.use("/api/products", productRoute);

//routes for orders
app.use("/api/orders", orderRoute);

// paypal payment api for client key;
app.use("/api/config/paypal", (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID);
  });
// Import the path module
const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route - this should be the last route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(port, () => console.log(`server started on port ${port}`))

app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});


module.exports = app;

