import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productAction } from "../Redux/Actions/Product";
import { addToCartAction } from "../Redux/Actions/Cart";
import {
  FiMinus,
  FiPlus,
  FiHeart,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import { IoCarSportOutline } from "react-icons/io5";
import { BsFileEarmarkText } from "react-icons/bs";
import TestDriveModal from "../components/TestDriveModal";
import ContractPurchaseModal from "../components/ContractPurchaseModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RelatedProducts from "../components/RelatedProducts";
import Layout from "../Layouts/Layouts";
import { TbProgress } from "react-icons/tb";
import LoadingSpinner from "../components/LoadingSpinner";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.productReducer);
  const { loading, error, product } = productReducer;

  const [qty, setQty] = useState(1);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showContractPurchaseModal, setShowContractPurchaseModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(productAction(id));
  }, [dispatch, id]);

  const addToCartHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      toast.error("Please login to add items to cart.");
      window.location.href = "/login";
      return;
    }
    
    const userId = userInfo._id;
    
    if (qty < 1 || qty > product.countInStock) {
      toast.error("Invalid quantity.");
      return;
    }
  
    dispatch(addToCartAction(userId, id, qty));
    toast.success("Item added to cart successfully!");
  };

  const openTestDriveModal = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to request a test drive.");
      window.location.href = "/login";
      return;
    }
    setShowTestDriveModal(true);
  };

  const closeTestDriveModal = () => setShowTestDriveModal(false);

  const openContractPurchaseModal = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please login to initiate contract purchase.");
      window.location.href = "/login";
      return;
    }
    setShowContractPurchaseModal(true);
  };

  const closeContractPurchaseModal = () => setShowContractPurchaseModal(false);

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner/>
      </Layout>
    );
  }

  if (error || !product || !product.image || product.image.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500 text-xl">{error || "No product data available."}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 py-20 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50">
              <img
                src={product.image[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`border-2 overflow-hidden ${
                    currentImageIndex === index ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600">
                {product.brand} - {product.yearOfMake}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  MWK {product.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              {product.countInStock > 0 ? (
                <p className="text-sm text-green-600">In stock</p>
              ) : (
                <p className="text-sm text-red-600 bg-red-50 p-2">Out of Stock</p>
              )}
            </div>

            <p className="text-gray-700 text-md leading-relaxed">
              {product.description}
            </p>

            {product.countInStock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 py-2 border-x">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  
                  <button
                    onClick={addToCartHandler}
                    className="flex-1 bg-red-600 text-white py-3 px-6 hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    <span>Buy Now</span>
                  </button>
                </div>

                {product.category === "Cars" && (
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={openTestDriveModal}
                      className="w-full py-3 px-4  bg-gray-900 text-white hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
                    >
                      <IoCarSportOutline className="w-5 h-5" />
                      <span>Request a Test Drive</span>
                    </button>
                    
                    <button
                      onClick={openContractPurchaseModal}
                      className="w-full py-3 px-4 bg-blue-900 text-white hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <BsFileEarmarkText className="w-5 h-5" />
                      <span>Contract Purchase</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900">Product Details</h3>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span>{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Year</span>
                  <span>{product.yearOfMake}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Category</span>
                  <span>{product.category}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Mileage</span>
                  <span>Km {product.mileage}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Color</span>
                  <span>{product.color}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-500">Oil</span>
                  <span>{product.oil}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showTestDriveModal && (
            <TestDriveModal
              isOpen={showTestDriveModal}
              onClose={closeTestDriveModal}
            />
          )}

          {showContractPurchaseModal && (
            <ContractPurchaseModal
              isOpen={showContractPurchaseModal}
              onClose={closeContractPurchaseModal}
            />
          )}
        </AnimatePresence>

        <RelatedProducts />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Layout>
  );
}

export default ProductDetail;