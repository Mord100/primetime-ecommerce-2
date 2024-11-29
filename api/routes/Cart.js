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

  if (!productId || !qty) {
    return res.status(400).json({ message: 'ProductId and quantity are required' });
  }

  try {
    let existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      existingCartItem.qty += parseInt(qty);
      await existingCartItem.save();
      const populatedItem = await existingCartItem.populate('productId');
      return res.json(populatedItem);
    }

    const newCartItem = new Cart({
      userId,
      productId,
      qty: parseInt(qty),
    });

    await newCartItem.save();
    const populatedNewItem = await newCartItem.populate('productId');
    res.status(201).json(populatedNewItem);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
});

// Update item quantity in cart
router.put('/:userId/:itemId', async (req, res) => {
  const { qty } = req.body;
  const userId = req.params.userId;
  const itemId = req.params.itemId;

  if (!qty || qty < 0) {
    return res.status(400).json({ message: 'Valid quantity is required' });
  }

  try {
    const cartItem = await Cart.findOneAndUpdate(
      { userId, _id: itemId },
      { qty: parseInt(qty) },
      { new: true }
    ).populate('productId');

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
router.delete('/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;
  console.log('DELETE request received:', { userId, itemId });

  try {
    console.log('Attempting to find and delete cart item...');
    const cartItem = await Cart.findOneAndDelete({ 
      userId, 
      _id: itemId 
    });
    console.log('Delete operation result:', cartItem);

    if (!cartItem) {
      console.log('Cart item not found');
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log('Item removed successfully');
    res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
});

module.exports = router;