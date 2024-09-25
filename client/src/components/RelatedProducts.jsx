import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { productListAction } from "../Redux/Actions/Product"
import { IoSearch } from "react-icons/io5"
import { TbProgress } from "react-icons/tb"
import { motion } from "framer-motion"

const Products = () => {
  const dispatch = useDispatch()
  const productListReducer = useSelector((state) => state.productListReducer)
  const { loading, error, products = [] } = productListReducer

  const [selectedBrand, setSelectedBrand] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    dispatch(productListAction())
  }, [dispatch])

  const filteredProducts = products.filter((product) =>
    (selectedBrand ? product.brand === selectedBrand : true) &&
    (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
    (selectedCategory !== "All" ? product.category === selectedCategory : true)
  )

  const categories = ["All", "Cars", "Farm Commodities", "Electronics", "Stationery", "Real Estates"]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <TbProgress size={40} className="animate-spin mr-3 text-[#f24c1c]" />
          <span className="text-xl font-semibold text-gray-700">Loading products...</span>
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500 text-xl font-semibold">{error}</div>
      ) : (
        <section className="py-12 px-4 md:px-12 font-sans">
          <div className="container mx-auto max-w-7xl">
            {/* <div className="flex w-full border-b mb-5 pb-5 items-center justify-between">            
              <h1 className="md:text-5xl text-2xl font-bold text-gray-900">Our Products</h1>
              <div className="relative w-full max-w-md ">
                <input
                  type="text"
                  placeholder="Search products" 
                  className="w-full p-4 pl-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-300 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div> */}


            <div className="mb-10 space-y-6">
              

              <div>
                {/* <h2 className="text-gray-900 font-bold text-2xl mb-4 text-center">Categories</h2> */}
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-6 py-3 rounded-lg transition duration-300 text-sm font-medium ${
                        selectedCategory === category
                          ? "bg-[#f24c1c] text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product._id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                  variants={itemVariants}
                >
                  <a href={`/products/${product._id}`} className="block">
                    <div className="aspect-w-1 aspect-h-1 h-64">
                      <img
                        alt={`Image of ${product.name}`}
                        className="w-full h-full object-cover object-center"
                        src={product.image}
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-gray-900 font-semibold text-lg mb-2">{product.name}</h2>
                      <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                      <span className="text-[#f24c1c] font-bold text-xl">MWK {product.price ? product.price.toFixed(2) : 'N/A'}</span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Products