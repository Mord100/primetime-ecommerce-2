import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PromoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const promos = [
    "Up to 60% Off: Use Code ACCESS",
    "Free Shipping on Orders Over $50",
    "New Arrivals: Shop the Latest Collection"
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto pt-20 bg-white w-full md:w-[50%]">
      <div className="flex items-center justify-center h-12 px-4">
        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 text-red-600 hover:text-gray-900"
          aria-label="Previous promotion"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>

        {/* Promo Text */}
        <div className="text-center text-sm font-medium text-gray-900">
          {promos[currentSlide]}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 text-red-600 hover:text-gray-900"
          aria-label="Next promotion"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              currentSlide === index ? 'w-4 bg-gray-900' : 'w-1 bg-gray-300'
            }`}
            aria-label={`Go to promotion ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;