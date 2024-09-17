import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { productListAction } from "../Redux/Actions/Product";
import { IoSearch } from "react-icons/io5";
import { TbProgress } from "react-icons/tb";

const Products = () => {
  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const { loading, error, products = [] } = productListReducer;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    dispatch(productListAction());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    (selectedBrand ? product.brand === selectedBrand : true) &&
    (searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
    (selectedCategory !== "All" ? product.category === selectedCategory : true)
  );

  const categories = ["All", "Cars", "Farm Commodities","Electronics", "Stationery", "Real Estates"];

  return (
    <div className="bg-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <TbProgress size={30} className="animate-spin mr-2 text-gray-600" />
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500">{error}</div>
      ) : (
        <section className="py-10 px-4 md:px-12 font-sans">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Products</h1>

            <div className="mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search products" 
                  className="w-full p-3 pl-10 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>

              {/* <select
                className="w-full md:w-auto p-3 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="BrandA">Brand A</option>
                <option value="BrandB">Brand B</option>
              </select> */}

              <h1 className="text-gray-900 font-bold text-xl mb-4">Categories</h1>
            <div className="mb-8 flex flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 m-1 rounded-md transition duration-300 text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <Link to={`/products/${product._id}`} className="block">
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
                      <span className="text-gray-900 font-bold text-xl">MWK {product.price ? product.price.toFixed(2) : 'N/A'}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Products;
