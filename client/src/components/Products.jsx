import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { productListAction } from "../Redux/Actions/Product";
import { IoSearch } from "react-icons/io5";
import { TbProgress } from "react-icons/tb";
import { motion } from "framer-motion";
import Select from "react-select";
import { CiShop } from "react-icons/ci";


const Products = () => {
  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const { loading, error, products = [] } = productListReducer;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCarBrand, setSelectedCarBrand] = useState("All"); // Change initial state to "All"
  const [selectedCarYear, setSelectedCarYear] = useState("All"); // Change initial state to "All"

  useEffect(() => {
    dispatch(productListAction());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedBrand ? product.brand === selectedBrand : true) &&
      (searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true) &&
      (selectedCategory !== "All"
        ? product.category === selectedCategory
        : true) &&
      (selectedCategory === "Cars" && selectedCarBrand !== "All"
        ? product.brand === selectedCarBrand
        : true) && // Update condition for brand
      (selectedCategory === "Cars" && selectedCarYear !== "All"
        ? product.yearOfMake === selectedCarYear
        : true) // Update condition for year
  );

  const categories = [
    "All",
    "Cars",
    "Farm Commodities",
    "Electronics",
    "Stationery",
    "Real Estates",
  ];

  // Extract unique brands and years from the products
  const carBrands = [
    ...new Set(
      products
        .filter((product) => product.category === "Cars")
        .map((product) => product.brand)
    ),
  ]; // Map all car brands
  const carYears = [
    ...new Set(
      products
        .filter((product) => product.category === "Cars")
        .map((product) => product.yearOfMake)
    ),
  ]; // Map all car years

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const brandOptions = [
    { value: "All", label: "All" },
    ...carBrands.map((brand) => ({ value: brand, label: brand })),
  ]; // Add "All" option
  const yearOptions = [
    { value: "All", label: "All" },
    ...carYears.map((year) => ({ value: year, label: year })),
  ]; // Add "All" option

  return (
    <div className="bg-gray-100 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <TbProgress size={40} className="animate-spin mr-3 text-[#f24c1c]" />
          <span className="text-xl font-semibold text-gray-700">
            Loading products...
          </span>
        </div>
      ) : error ? (
        <div className="text-center p-10 text-red-500 text-xl font-semibold">
          {error}
        </div>
      ) : (
        <section className="py-12 px-4 md:px-12 font-sans">
          <div className="container mx-auto max-w-7xl">
            <div className="flex w-full border-b mb-5 pb-5 items-center justify-between">
              <h1 className="md:text-5xl hidden md:block lg:block font-bold text-gray-900">
                Our Products
              </h1>
              <div className="relative w-full max-w-lg ">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full p-4 pl-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition duration-300 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={24}
                />
              </div>
            </div>

            <div className="mb-10 space-y-6">
              <div>
                <h2 className="text-gray-900  font-light text-2xl mb-4 text-center">
                  <div className="flex gap-2 items-center mx-auto justify-center">

                <CiShop /> Categories
                  </div>
                </h2>
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
              {selectedCategory === "Cars" && (
                <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 border-t pt-5">
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-gray-900 font-light text-xl mb-2">
                      Brand
                    </h2>
                    <Select
                      options={brandOptions}
                      value={brandOptions.find(
                        (brand) => brand.value === selectedCarBrand
                      )}
                      onChange={(option) => setSelectedCarBrand(option.value)}
                      className="w-full md:w-64"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h2 className="text-gray-900 font-light text-xl mb-2">
                      Year of Make
                    </h2>
                    <Select
                      options={yearOptions}
                      value={yearOptions.find(
                        (year) => year.value === selectedCarYear
                      )}
                      onChange={(option) => setSelectedCarYear(option.value)}
                      className="w-full md:w-64"
                    />
                  </div>
                </div>
              )}
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                          src={
                            product.image && product.image.length > 0
                              ? product.image[0]
                              : "fallback-image-url.jpg"
                          } // Use a fallback image if undefined
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-gray-900 font-semibold text-lg mb-2">
                          {product.name}
                        </h2>
                        <p className="text-gray-600 text-sm mb-3">
                          {product.brand}
                        </p>
                        <span className="text-[#f24c1c] font-bold text-xl">
                        MWK {product.price ? product.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'}
                        </span>
                      </div>
                    </a>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center w-full justify-center text-center p-10 text-red-500 text-lg mx-auto">
                  No Items Available
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Products;
