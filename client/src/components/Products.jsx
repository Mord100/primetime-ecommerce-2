import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { IoSearch, IoFilterSharp, IoGrid, IoList } from "react-icons/io5";
import { TbProgress } from "react-icons/tb";
import { motion } from "framer-motion";
import Select from "react-select";
import { CiShop } from "react-icons/ci";
import { productListAction } from "../Redux/Actions/Product";


const Products = () => {
  const dispatch = useDispatch();
  const productListReducer = useSelector((state) => state.productListReducer);
  const { loading, error, products = [] } = productListReducer;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCarBrand, setSelectedCarBrand] = useState("All");
  const [selectedCarYear, setSelectedCarYear] = useState("All");
  const [viewMode, setViewMode] = useState('grid');
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
    "All",
    "Cars",
    "Farm Commodities",
    "Electronics",
    "Stationery",
    "Real Estates",
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
    <motion.div
      variants={itemVariants}
      className={`bg-white rounded-md overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full'}`}>
        <img
          alt={`Image of ${product.name}`}
          className="w-full h-64 object-cover object-center"
          src={product.image?.[0] || "fallback-image-url.jpg"}
        />
      </div>
      <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-gray-900 font-semibold text-xl mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mb-3">
              {product.brand} | {product.yearOfMake}
            </p>
          </div>
          <span className="text-[#f24c1c] font-bold text-xl">
            MWK {product.price?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || 'N/A'}
          </span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description || "No description available"}
        </p>

      </div>
    </motion.div>
  );

  // Mobile Filters Overlay
  const MobileFilters = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${mobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white transform transition-transform ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <FilterContent />
        </div>
      </div>
    </div>
  );

  // Filter Content Component
  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        {categories.map((category) => (
          <button
            key={category}
            className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
              selectedCategory === category
                ? 'bg-[#fff3f0] text-[#f24c1c] font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {selectedCategory === "Cars" && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Car Brands</h3>
            {carBrands.map((brand) => (
              <button
                key={brand}
                className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
                  selectedCarBrand === brand
                    ? 'bg-[#fff3f0] text-[#f24c1c] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCarBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Year</h3>
            {carYears.map((year) => (
              <button
                key={year}
                className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
                  selectedCarYear === year
                    ? 'bg-[#fff3f0] text-[#f24c1c] font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCarYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price (MWK)</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f24c1c]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price (MWK)</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#f24c1c]"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
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
        <div className="container mx-auto max-w-7xl px-4 py-20">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-900 to-red-500 text-white rounded-xl p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
            <p className="text-gray-300 max-w-2xl">
              Browse through our carefully curated collection of premium products. 
              From luxury cars to electronics, we ensure quality and authenticity in every item.
            </p>
          </div>

          {/* Search and View Toggle */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f24c1c] transition duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoSearch
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={24}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-md ${
                  viewMode === 'grid'
                    ? 'bg-[#f24c1c] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                <IoGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-[#f24c1c] text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                <IoList size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-md p-6 shadow-sm">
                <FilterContent />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {filteredProducts.length} Products Found
                </h2>
                <button
                  className="md:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <IoFilterSharp /> Filters
                </button>
              </div>

              <motion.div
                className={`grid ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                } gap-6`}
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
                  <div className="col-span-full flex items-center justify-center text-center p-10 text-gray-500 text-lg">
                    No products found matching your criteria
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Mobile Filters */}
          <MobileFilters />
        </div>
      )}
    </div>
  );
};

export default Products;