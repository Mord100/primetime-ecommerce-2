import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { productListAction } from "../Redux/Actions/Product";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react';
import { TbProgress } from "react-icons/tb";
import LoadingSpinner from './LoadingSpinner';

const CreativeProductCarousel = () => {
  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const { loading, error, products = [] } = productListReducer;
  
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const itemsToShow = 4; // Showing fewer items for larger cards

  useEffect(() => {
    dispatch(productListAction());
  }, [dispatch]);

  const nextSlide = () => {
    if (startIndex + itemsToShow < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto ">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-light">
              Related <span className="text-[#f24c1c] font-medium">Products</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={prevSlide}
              disabled={startIndex === 0}
              className={`p-3 ${startIndex === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white shadow-md hover:shadow-lg text-gray-700'} transition-all duration-200`}
              whileHover={startIndex > 0 ? { scale: 1.1 } : {}}
              whileTap={startIndex > 0 ? { scale: 0.9 } : {}}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              disabled={startIndex + itemsToShow >= products.length}
              className={`p-3 ${startIndex + itemsToShow >= products.length ? 'bg-gray-100 text-gray-400' : 'bg-white shadow-md hover:shadow-lg text-gray-700'} transition-all duration-200`}
              whileHover={startIndex + itemsToShow < products.length ? { scale: 1.1 } : {}}
              whileTap={startIndex + itemsToShow < products.length ? { scale: 0.9 } : {}}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: `-${startIndex * (100 / itemsToShow)}%`
            }}
            transition={{ type: "tween", duration: 0.5 }}
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                className="flex-none w-[calc(25%-18px)]"
                onHoverStart={() => setHoveredId(product._id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <motion.div
                  className="relative bg-white"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <a href={`/products/${product._id}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={product.image?.[0] || "fallback-image-url.jpg"}
                        alt={`Image of ${product.name}`}
                        className="w-full h-full object-cover"
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredId === product._id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                          y: hoveredId === product._id ? 0 : 20,
                          opacity: hoveredId === product._id ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="bg-white backdrop-blur-sm p-4 shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-[#f24c1c] mb-1">
                              {product.category}
                            </p>
                            <h3 className="text-lg font-medium text-gray-900 leading-tight">
                              {product.name}
                            </h3>
                          </div>
                          <span className="text-sm font-bold text-[#f24c1c] whitespace-nowrap">
                            MWK {product.price?.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }) || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{product.brand}</p>
                          <motion.button
                            className="flex items-center gap-2 px-4 py-2 bg-[#f24c1c] text-white rounded-lg text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            View
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreativeProductCarousel;