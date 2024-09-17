import { useParams } from "react-router-dom";
import Layout from "../Layouts/Layouts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { productAction } from "../Redux/Actions/Product";
import { addToCartAction } from "../Redux/Actions/Cart";
import { FiMinus, FiPlus, FiHeart, FiShoppingCart } from "react-icons/fi";
import TestDriveModal from "../components/TestDriveModal";
import ContractPurchaseModal from "../components/ContractPurchaseModal";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productReducer = useSelector((state) => state.productReducer);
  const { loading, error, product } = productReducer;

  useEffect(() => {
    dispatch(productAction(id));
  }, [dispatch, id]);

  const [qty, setQty] = useState(1);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showContractPurchaseModal, setShowContractPurchaseModal] = useState(false);

  const addToCartHandler = () => {
    dispatch(addToCartAction(id, qty));
    toast.success("Item added to cart successfully!");
  };

  const openTestDriveModal = () => {
    setShowTestDriveModal(true);
  };

  const closeTestDriveModal = () => {
    setShowTestDriveModal(false);
  };

  const openContractPurchaseModal = () => {
    setShowContractPurchaseModal(true);
  };

  const closeContractPurchaseModal = () => {
    setShowContractPurchaseModal(false);
  };
  return (
    <>
      <Layout>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="w-6 h-6 border-2 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="lg:w-1/3 space-y-6">
                <h1 className="text-3xl font-semibold text-gray-900">{product.name}</h1>
                <p className="text-2xl font-medium text-gray-700">MWK {product.price.toFixed(2)}</p>
                <p className="text-gray-600 text-lg">{product.description}</p>
                
                {product.countInStock > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <FiMinus className="w-5 h-5" />
                      </button>
                      <span className="font-medium text-xl">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <FiPlus className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={addToCartHandler}
                      className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-lg"
                    >
                      <FiShoppingCart className="w-6 h-6" />
                      <span>BUY NOW</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-red-500 text-lg font-medium">Out of Stock</p>
                )}
                
                {product.category === "Cars" && (
                  <div className="space-y-4">
                    <button 
                      onClick={openTestDriveModal}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-lg"
                    >
                      <span>Request a test drive</span>
                    </button>
                    <button 
                      onClick={openContractPurchaseModal}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg"
                    >
                      <span>Contract Purchase</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showTestDriveModal && (
          <TestDriveModal isOpen={showTestDriveModal} onClose={closeTestDriveModal} />
        )}

        {showContractPurchaseModal && (
          <ContractPurchaseModal isOpen={showContractPurchaseModal} onClose={closeContractPurchaseModal} />
        )}
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ProductDetail;