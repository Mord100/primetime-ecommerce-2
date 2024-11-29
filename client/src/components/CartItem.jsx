import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { BsCart2 } from "react-icons/bs";

import {
  removeFromCartAction,
  fetchCartItemsAction,
  updateCartItemQuantity,
} from "../Redux/Actions/Cart";

const CartItem = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userLoginReducer?.userInfo?._id);
  const { cartItems = [], loading = false, error = null, cartTotals } = useSelector((state) => state.cartReducer || {});

  useEffect(() => {
    if (userId) dispatch(fetchCartItemsAction(userId));
  }, [userId, dispatch]);

  if (loading)
    return <div className="text-center py-8 text-gray-600">Loading cart...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!cartItems.length)
    return <p className="text-center py-8 text-gray-600">Your cart is empty</p>;

  const removeFromCartHandler = (itemId) => {
    if (userId) dispatch(removeFromCartAction(userId, itemId));
  };

  const updateQuantityHandler = (itemId, qty, countInStock) => {
    if (userId) {
      const validQty = Math.max(1, Math.min(qty, countInStock));
      dispatch(updateCartItemQuantity(userId, itemId, validQty));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center mb-8 space-x-3">
        <BsCart2 size={30} className="text-gray-600" />
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
      </div>

      <div className="space-y-6">
        {cartItems.map((cartItem) => {
          const product = cartItem.productId;
          const productId = product._id;
          const qty = cartItem.qty;

          return (
            <div
              key={cartItem._id}
              className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-md font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 flex text-sm mt-1">MWK {product.price?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Color:</span> {product.color || "N/A"}
                </p>
               
              </div>
              <div className="flex items-center">
                <div className="flex items-center mb-2">
                  <button
                    onClick={() =>
                      updateQuantityHandler(productId, qty - 1, product.countInStock)
                    }
                    className="p-1 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="mx-2 text-gray-800">{qty}</span>
                  <button
                    onClick={() =>
                      updateQuantityHandler(productId, qty + 1, product.countInStock)
                    }
                    className="p-1 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCartHandler(productId)}
                  className="text-red-500 mb-2 px-1 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {cartTotals && (
        <div className="mt-8 border-t pt-6 space-y-3">
          <div className="flex justify-between text-lg">
            <span className="font-medium text-gray-700">Subtotal</span>
            <span className="text-gray-800">
              MWK {cartTotals.subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-medium text-gray-700">Shipping</span>
            <span className="text-gray-800">
              MWK {cartTotals.shipping.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span className="text-green-600">
              MWK {cartTotals.total.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
