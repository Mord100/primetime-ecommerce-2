import { useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { addToCartAction, removeFromCartAction } from "../Redux/Actions/Cart";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function CartItem({ cartItems }) {
  const dispatch = useDispatch();
  const { id: productIdFromParams } = useParams(); // Get product ID from URL params (if needed)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productIdFromSearch = searchParams.get('productId'); // Get product ID from search params (if needed)

  // Get user information from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo._id || null; // Fallback if no user info is found

  // Remove item from cart handler
  const removeFromCartHandler = (productId) => {
    try {
      dispatch(removeFromCartAction(userId, productId));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // Add item to cart handler
  const addToCartHandler = (productId, qty) => {
    try {
      const validQty = Math.max(1, qty); // Ensure quantity is at least 1
      dispatch(addToCartAction(userId, productId, validQty));
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Handle empty cart state
  if (!cartItems || cartItems.length === 0) {
    return <p>No items in the cart.</p>;
  }

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          <AnimatePresence>
            {cartItems.map((product) => (
              <motion.li
                key={product.product} // Use unique product ID as key
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex py-6 sm:py-10"
              >
                <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    alt={product.name}
                    src={product.image}
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
                            {product.name}
                          </a>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        MWK {product?.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <label htmlFor={`quantity-${product.product}`} className="sr-only">
                        Quantity, {product.name}
                      </label>
                      <div className="flex items-center">
                        <button
                          onClick={() => addToCartHandler(product.product, Math.max(1, product.qty - 1))}
                          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <input
                          id={`quantity-${product.product}`}
                          name={`quantity-${product.product}`}
                          value={product.qty}
                          onChange={(e) => addToCartHandler(product.product, Number(e.target.value))}
                          className="mx-2 w-12 rounded border-gray-300 text-center sm:text-sm"
                          type="number"
                          min="1" // Ensure the minimum quantity is 1
                        />
                        <button
                          onClick={() => addToCartHandler(product.product, Math.min(product.countInStock, product.qty + 1))}
                          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <p className="text-sm text-gray-600">
                      Subtotal: MWK {(product.price * product.qty).toFixed(2)}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="flex items-center text-sm font-medium text-[#f24c1c] hover:text-[#00315a]"
                      onClick={() => removeFromCartHandler(product.product)} // Use product.product as the product ID
                    >
                      <FiTrash2 className="mr-1 h-4 w-4" />
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
