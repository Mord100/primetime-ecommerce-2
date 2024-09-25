import { useDispatch } from "react-redux"
import { addToCartAction, removeFromCartAction } from "../Redux/Actions/Cart"
import { motion, AnimatePresence } from "framer-motion"
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi"

export default function CartItem({ cartItems }) {
  const dispatch = useDispatch()

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCartAction(id))
  }

  const addToCartHandler = (id, qty) => {
    dispatch(addToCartAction(id, qty))
  }

  return (
    <div className="mt-8">
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200">
          <AnimatePresence>
            {cartItems.map((product) => (
              <motion.li
                key={product.product}
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
                          <a href={`/product/${product.product}`} className="font-medium text-gray-700 hover:text-gray-800">
                            {product.name}
                          </a>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">MWK {product.price.toFixed(2)}</p>
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
                    <p className="text-sm text-gray-600">Subtotal: MWK {(product.price * product.qty).toFixed(2)}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="flex items-center text-sm font-medium text-[#f24c1c] hover:text-[#00315a]"
                      onClick={() => removeFromCartHandler(product.product)}
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
  )
}