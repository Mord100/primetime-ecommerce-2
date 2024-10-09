const router = require("express").Router();
const User = require("./models/User");
const users = require("./data/Users");
const Product = require("./models/Product");
const products = require("./data/products");
const cartItems = require("./data/Cart");
const AsynHandler = require("express-async-handler");
const Cart = require("./models/Cart");


router.post(
  "/users",
  AsynHandler(async (req, res) => {
    await User.deleteMany({});
    const UserSeeder = await User.insertMany(users);
    res.send({ UserSeeder });
  })
);

router.post(
  "/products",
  AsynHandler(async (req, res) => {
    await Product.deleteMany({});
    const ProductSeeder = await Product.insertMany(products);
    res.send({ ProductSeeder });
  })
);

router.post(
  "/cart",
  AsynHandler(async (req, res) => {
    await Cart.deleteMany({}); // Clear existing cart items

    // Fetch existing users and products to set IDs for the cart items
    const seededUsers = await User.find({});
    const seededProducts = await Product.find({});

    // Assign seeded userId and productId to the cartItems
    cartItems[0].userId = seededUsers[0]._id;
    cartItems[0].productId = seededProducts[0]._id;
    cartItems[1].userId = seededUsers[1]._id;
    cartItems[1].productId = seededProducts[1]._id;

    // Insert cart items into the Cart collection
    const CartSeeder = await Cart.insertMany(cartItems);

    res.send({ CartSeeder });
  })
);

module.exports = router;