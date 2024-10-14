import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import {
  addToCartAction,
  removeFromCartAction,
  fetchCartItemsAction,
  resetCartAction,
} from "../Redux/Actions/Cart";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function CartItem() {
  const dispatch = useDispatch();
  const { id: productIdFromParams } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productIdFromSearch = searchParams.get("productId");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo._id;

  const cartItemsByUser = useSelector((state) =>
    state.cartReducer.cartItems?.filter((item) => item.userId == userInfo?._id)
  );
  // Safely access cart state with a default empty object
  const {
    cartItems = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.cart || {});

  useEffect(() => {
    if (userId) {
      dispatch(resetCartAction());
      dispatch(fetchCartItemsAction(userId));
    }
  }, [userId, dispatch]);

  const removeFromCartHandler = (productId) => {
    try {
      dispatch(removeFromCartAction(userId, productId));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const addToCartHandler = (productId, qty) => {
    try {
      const validQty = Math.max(1, qty);
      dispatch(addToCartAction(userId, productId, validQty));
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return <div>Loading cart items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cartItemsByUser || cartItemsByUser.length === 0) {
    return <p>No items in the cart.</p>;
  }

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          <AnimatePresence>
            {cartItemsByUser &&
              cartItemsByUser?.map((product, key) => {
                return (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex py-6 sm:py-10"
                  >
                    <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        alt={product?.productId?.name}
                        src={product?.productId?.image}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <a
                                href={`/product/${product.product}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product?.productId?.name}
                              </a>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            MWK {product?.productId?.price?.toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${product.product}`}
                            className="sr-only"
                          >
                            Quantity, {product?.productId?.name}
                          </label>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                addToCartHandler(
                                  product.product,
                                  Math.max(1, product.qty - 1)
                                )
                              }
                              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <input
                              id={`quantity-${product.product}`}
                              name={`quantity-${product.product}`}
                              value={product.qty}
                              onChange={(e) =>
                                addToCartHandler(
                                  product.product,
                                  Number(e.target.value)
                                )
                              }
                              className="mx-2 w-12 rounded border-gray-300 text-center sm:text-sm"
                              type="number"
                              min="1" // Ensure the minimum quantity is 1
                            />
                            <button
                              onClick={() =>
                                addToCartHandler(
                                  product.product,
                                  Math.min(
                                    product.countInStock,
                                    product.qty + 1
                                  )
                                )
                              }
                              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between">
                        <p className="text-sm text-gray-600">
                          Subtotal: MWK{" "}
                          {(product?.productId?.price * product.qty).toFixed(2)}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          className="flex items-center text-sm font-medium text-[#f24c1c] hover:text-[#00315a]"
                          onClick={() =>
                            removeFromCartHandler(product?.productId?.product)
                          } // Use product.product as the product ID
                        >
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
