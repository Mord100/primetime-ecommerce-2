import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { productAction } from "../Redux/Actions/Product"
import { addToCartAction } from "../Redux/Actions/Cart"
import { FiMinus, FiPlus, FiHeart, FiShoppingCart, FiTruck } from "react-icons/fi"
import { IoCarSportOutline } from "react-icons/io5"
import { BsFileEarmarkText } from "react-icons/bs"
import TestDriveModal from "../components/TestDriveModal"
import ContractPurchaseModal from "../components/ContractPurchaseModal"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RelatedProducts from "../components/RelatedProducts"
import Layout from "../Layouts/Layouts"

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const productReducer = useSelector((state) => state.productReducer)
  const { loading, error, product } = productReducer

  const [qty, setQty] = useState(1)
  const [showTestDriveModal, setShowTestDriveModal] = useState(false)
  const [showContractPurchaseModal, setShowContractPurchaseModal] = useState(false)

  useEffect(() => {
    dispatch(productAction(id))
  }, [dispatch, id])

  const addToCartHandler = () => {
    dispatch(addToCartAction(id, qty))
    toast.success("Item added to cart successfully!")
  }

  const openTestDriveModal = () => setShowTestDriveModal(true)
  const closeTestDriveModal = () => setShowTestDriveModal(false)
  const openContractPurchaseModal = () => setShowContractPurchaseModal(true)
  const closeContractPurchaseModal = () => setShowContractPurchaseModal(false)

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-xl">No product data available.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 max-w-7xl"
      >
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            className="lg:w-3/5"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                <FiHeart className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-2/5 space-y-8"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brand}</p>
            </div>
            <p className="text-5xl font-semibold text-blue-600">
              MWK {product.price ? product.price.toFixed(2) : 'N/A'}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            
            {product.countInStock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-gray-100 rounded-full p-2 w-max">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition-colors"
                  >
                    <FiMinus className="w-6 h-6" />
                  </button>
                  <span className="font-medium text-2xl w-12 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition-colors"
                  >
                    <FiPlus className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={addToCartHandler}
                  className="w-full py-4 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span>Add to Cart</span>
                </button>
              </div>
            ) : (
              <p className="text-red-500 text-xl font-medium bg-red-100 p-4 rounded-lg">Out of Stock</p>
            )}
            
            {product.category === "Cars" && (
              <div className="space-y-4 pt-4">
                <button 
                  onClick={openTestDriveModal}
                  className="w-full py-3 px-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-lg font-medium hover:shadow-md"
                >
                  <IoCarSportOutline className="w-6 h-6" />
                  <span>Request a Test Drive</span>
                </button>
                <button 
                  onClick={openContractPurchaseModal}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <BsFileEarmarkText className="w-6 h-6" />
                  <span>Contract Purchase</span>
                </button>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Product Details</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-gray-700">
                  <FiTruck className="w-5 h-5 text-blue-500" />
                  <span>Free shipping on orders over MWK 50,000</span>
                </li>
                <li className="flex items-center space-x-2 text-gray-700">
                  <FiHeart className="w-5 h-5 text-blue-500" />
                  <span>Satisfaction guaranteed or your money back</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTestDriveModal && (
          <TestDriveModal isOpen={showTestDriveModal} onClose={closeTestDriveModal} />
        )}

        {showContractPurchaseModal && (
          <ContractPurchaseModal isOpen={showContractPurchaseModal} onClose={closeContractPurchaseModal} />
        )}
      </AnimatePresence>

      <RelatedProducts />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </Layout>
  )
}

export default ProductDetail