import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import {
  removeFromCartAction,
  fetchCartItemsAction,
  updateCartItemQuantity,
} from "../Redux/Actions/Cart";

const CartItem = () => {
  const dispatch = useDispatch();

  // Get user ID and cart data from Redux
  const userId = useSelector((state) => {
    const userInfo = state.userLoginReducer?.userInfo;
    return userInfo?._id;
  });

  const {
    cartItems = [],
    loading = false,
    error = null,
    cartTotals,
  } = useSelector((state) => state.cartReducer || {});

  // Fetch cart items when component mounts or user changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItemsAction(userId));
    }
  }, [userId, dispatch]);

  // Error and loading states
  if (loading) return <div className="text-center py-4">Loading cart...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!cartItems.length)
    return <p className="text-center py-4">Your cart is empty</p>;

  // Cart item removal handler
  const removeFromCartHandler = (itemId) => {
    if (userId) {
      dispatch(removeFromCartAction(userId, itemId));
    }
  };

  // Quantity update handler with validation
  const updateQuantityHandler = (itemId, qty, countInStock) => {
    if (userId) {
      const validQty = Math.max(1, Math.min(qty, countInStock));
      dispatch(updateCartItemQuantity(userId, itemId, validQty));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {/* Cart Items List */}
      <div className="space-y-4">
        <AnimatePresence>
          {cartItems.map((cartItem) => {
            const product = cartItem.productId;
            const productId = product._id;
            const qty = cartItem.qty;

            return (
              <motion.div
                key={cartItem._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center border-b pb-4"
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover mr-4"
                />

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    MWK {product.price ? product.price.toLocaleString() : "N/A"}
                  </p>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantityHandler(
                        productId,
                        qty - 1,
                        product.countInStock
                      )
                    }
                    className="p-2 bg-gray-200 rounded-l"
                  >
                    <FiMinus />
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-16 text-center border"
                  />
                  <button
                    onClick={() =>
                      updateQuantityHandler(
                        productId,
                        qty + 1,
                        product.countInStock
                      )
                    }
                    className="p-2 bg-gray-200 rounded-r"
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCartHandler(productId)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={24} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cart Summary */}
      {cartTotals && (
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>MWK {cartTotals.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>MWK {cartTotals.shipping.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartItem;
