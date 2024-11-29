const express = require("express");
const orderRoute = express.Router();
const protect = require("../middleware/Auth");
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

// Helper function to validate and format price
const formatPrice = (price) => {
  try {
    if (price === null || price === undefined) {
      return 0;
    }
    if (typeof price === 'string') {
      return Number(price.replace(/[^0-9.-]+/g, '')) || 0;
    }
    return Number(price) || 0;
  } catch (error) {
    console.error('Error formatting price:', price, error);
    return 0;
  }
};

// Validate order items
const validateOrderItems = (items) => {
  if (!Array.isArray(items)) return false;
  return items.every(item => 
    item && 
    item.productId && 
    typeof item.qty === 'number' && 
    item.qty > 0
  );
};

orderRoute.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice = 0,
        taxPrice = 0,
        totalPrice = 0,
        price = 0,
      } = req.body;

      console.log('Received order request:', {
        orderItemsCount: orderItems?.length,
        shippingAddress,
        paymentMethod,
        totalPrice
      });

      // Validate required fields
      if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({
          message: "No order items found"
        });
      }

      if (!shippingAddress || !shippingAddress.address) {
        return res.status(400).json({
          message: "Shipping address is required"
        });
      }

      if (!validateOrderItems(orderItems)) {
        return res.status(400).json({
          message: "Invalid order items format"
        });
      }

      // Transform orderItems to match schema
      const transformedOrderItems = orderItems.map(item => {
        try {
          // Handle image array - take the first image
          const image = Array.isArray(item.productId.image) 
            ? item.productId.image[0] 
            : (item.productId.image || '');

          return {
            name: item.productId.name || '',
            qty: Number(item.qty) || 1,
            image: image,
            price: formatPrice(item.productId.price),
            product: item.productId._id || item.productId
          };
        } catch (error) {
          console.error('Error transforming order item:', item, error);
          return null;
        }
      }).filter(item => item !== null);

      if (transformedOrderItems.length === 0) {
        return res.status(400).json({
          message: "No valid order items after transformation"
        });
      }

      // Format received prices
      const formattedTotalPrice = formatPrice(totalPrice);
      const formattedPrice = formatPrice(price);
      const formattedTaxPrice = formatPrice(taxPrice);
      const formattedShippingPrice = formatPrice(shippingPrice);

      const order = new Order({
        orderItems: transformedOrderItems,
        user: req.user._id,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city || '',
          postalCode: shippingAddress.postalCode || '',
          country: shippingAddress.country || ''
        },
        paymentMethod: paymentMethod || 'paychangu',
        shippingPrice: formattedShippingPrice,
        taxPrice: formattedTaxPrice,
        totalPrice: formattedTotalPrice,
        price: formattedPrice
      });

      console.log('Creating order with data:', {
        itemsCount: order.orderItems.length,
        totalPrice: order.totalPrice,
        userId: order.user
      });

      const createdOrder = await order.save();
      console.log('Order created successfully:', createdOrder._id);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error('Error in order creation:', error);
      res.status(500).json({
        message: error.message || 'Error creating order',
        details: process.env.NODE_ENV === 'production' ? null : error.stack
      });
    }
  })
);

// Get order by ID
orderRoute.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        message: error.message || 'Error fetching order',
        details: process.env.NODE_ENV === 'production' ? null : error.stack
      });
    }
  })
);

//order detail

orderRoute.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// Update order to paid
orderRoute.put(
  "/:id/payment",
  protect,
  asyncHandler(async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update order
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id || 'paychangu_payment',
        status: req.body.status || 'completed',
        update_time: Date.now(),
        email_address: req.body.email || req.user.email,
      };

      const updatedOrder = await order.save();
      console.log('Order payment updated successfully:', updatedOrder._id);
      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order payment:', error);
      res.status(500).json({
        message: error.message || 'Error updating order payment',
        details: process.env.NODE_ENV === 'production' ? null : error.stack
      });
    }
  })
);

//order lists

orderRoute.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {

    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    if (orders) {
      res.status(200).json(orders);
    } else {
      res.status(404);
      throw new Error("Orders Not Found");
    }
  })
);


module.exports = orderRoute;