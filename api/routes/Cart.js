const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Fetch cart items for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Error fetching cart data', error: error.message });
  }
});

// Add item to cart
router.post('/:userId', async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.params.userId;

  try {
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.qty += qty;
      await existingCartItem.save();
      return res.json(existingCartItem);
    }

    const newCartItem = new Cart({
      userId,
      productId,
      qty,
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update item quantity in cart
router.put('/:userId/:productId', async (req, res) => {
    const { qty } = req.body;
    const userId = req.params.userId;
    const productId = req.params.productId;
  
    try {
      const cartItem = await Cart.findOneAndUpdate(
        { userId, _id: productId },
        { qty },
        { new: true }
      );
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.json(cartItem);
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
      res.status(500).json({ message: 'Error updating item quantity in cart', error: error.message });
    }
  });
  
  // Remove item from cart
  router.delete('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const productId = req.query.productId; // Changed from req.params.productId to req.query.productId
  
    try {
      const cartItem = await Cart.findOneAndDelete({ userId, productId });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(204).send(); // No content
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ message: 'Error removing item from cart', error: error.message });
    }
  });

module.exports = router;
