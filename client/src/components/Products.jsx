import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { IoSearch, IoFilterSharp, IoGrid, IoList } from "react-icons/io5";
import { TbProgress } from "react-icons/tb";
import { motion } from "framer-motion";
import Select from "react-select";
import { CiShop } from "react-icons/ci";
import { productListAction } from "../Redux/Actions/Product";
import LoadingSpinner from './LoadingSpinner';
import { FaGasPump, FaCar, FaTractor, FaLaptop, FaPencilAlt, FaHome } from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";
import PromoSlider from './Slider';

const Products = () => {
  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const { loading, error, products = [] } = productListReducer;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCarBrand, setSelectedCarBrand] = useState("All");
  const [selectedCarYear, setSelectedCarYear] = useState("All");
  const [viewMode, setViewMode] = useState('list');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(productListAction());
  }, [dispatch]);

  useEffect(() => {
    console.log("Products:",products);
  }, [products]);

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
        : true) &&
      (selectedCategory === "Cars" && selectedCarYear !== "All"
        ? product.yearOfMake === selectedCarYear
        : true) &&
      (product.price >= minPrice && product.price <= maxPrice)
  );

  const categories = [
    { name: "All", icon: <CiShop /> },
    { name: "Cars", icon: <FaCar /> },
    { name: "Farm Commodities", icon: <FaTractor /> },
    { name: "Electronics", icon: <FaLaptop /> },
    { name: "Stationery", icon: <FaPencilAlt /> },
    { name: "Real Estate", icon: <FaHome /> },
  ];

  const carBrands = [
    ...new Set(
      products
        .filter((product) => product.category === "Cars")
        .map((product) => product.brand)
    ),
  ];

  const carYears = [
    ...new Set(
      products
        .filter((product) => product.category === "Cars")
        .map((product) => product.yearOfMake)
    ),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const ProductCard = ({ product, viewMode }) => (
    <a href={`/products/${product._id}`}>
      <motion.div
        variants={itemVariants}
        className={`overflow-hidden border rounded-lg shadow-sm border-gray-50 transition-all duration-300 ${
          viewMode === 'list' && window.innerWidth > 768 ? 'flex' : ''
        }`}
      >
        <div className={`${viewMode === 'list' && window.innerWidth > 768 ? 'w-1/3' : 'w-full'} relative group`}>
          <img
            alt={`Image of ${product.name}`}
            className="w-full h-50 object-contain object-center rounded-lg  shadow-lg transition-transform duration-700 group-hover:scale-105"
            src={product.image?.[0] || "fallback-image-url.jpg"}
          />
        </div>
        <div className={`pt-4 p-4 ${viewMode === 'list' && window.innerWidth > 768 ? 'w-2/3 px-8' : 'w-full'}`}>
          <div className="flex justify-between items-start mb-1">
            <div className="flex-grow">
              <h2 className="text-lg text-red-600 font-medium hover:text-gray-700 transition-colors">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {product.category}
              </p>
            </div>
            <span className="text-gray-900 font-mono font-bold">
              MWK {product.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">{product.brand}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-500">{product.yearOfMake}</span>
          </div>
          {viewMode === 'list' && (
            <div className="">
            <p className="text-gray-600 bg-green-50 rounded-md p-2 text-sm flex gap-2 items-center leading-relaxed mt-4">
              <GiCarWheel />
              {product.mileage || "No model available"} Kilometers
            </p>
            <p className="text-gray-600 bg-blue-50 rounded-md p-2 text-sm flex gap-2 items-center leading-relaxed mt-4">
            <FaGasPump />
            {product.oil}
            </p>
            </div>
          )}
        </div>
      </motion.div>
    </a>
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-red-600 border-b pb-3 mb-4">Categories</h3>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`flex items-center w-full text-left py-2 text-sm transition-colors ${
              selectedCategory === category.name
                ? 'text-black font-medium'
                : 'text-gray-700 hover:text-black'
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory === "Cars" && (
        <>
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Car Brands</h3>
            {carBrands.map((brand) => (
              <button
                key={brand}
                className={`block w-full text-left py-2 text-sm transition-colors ${
                  selectedCarBrand === brand
                    ? 'text-black font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
                onClick={() => setSelectedCarBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Year</h3>
            {carYears.map((year) => (
              <button
                key={year}
                className={`block w-full text-left py-2 text-sm transition-colors ${
                  selectedCarYear === year
                    ? 'text-black font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
                onClick={() => setSelectedCarYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      )}

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Min Price (MWK)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Max Price (MWK)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen p-4 md:px-24">
      {loading ? (
        <LoadingSpinner/>
      ) : error ? (
        <div className="text-center p-10 text-red-600 text-xl">
          {error}
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-auto py-12">
          <PromoSlider/>
          <div className="mb-12">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
              <h1 className="text-3xl font-medium text-gray-900">Products</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <IoGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'text-black'
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <IoList size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-4 pl-12 pr-4 bg-gray-100 border-0 outline-none text-gray-900 placeholder-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-gray-400"
                size={20}
              />
            </div>
          </div>

          <div className="flex gap-12">
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                </div>
                <FilterContent />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-medium border-b-2 border-gray-900 text-gray-900">
                  {filteredProducts.length} Products
                </h2>
                <button
                  className="md:hidden flex items-center gap-2 text-gray-600 hover:text-black"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <IoFilterSharp /> Filters
                </button>
              </div>

              <motion.div
                className={`grid ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                } gap-8`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white transform transition-transform ${mobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="h-full overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  <button 
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-400 hover:text-black p-2"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <FilterContent />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;