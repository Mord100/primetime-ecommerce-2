import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      title: "Cars",
      description: "Discover a wide range of vehicles for every need and budget."
    },
    {
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      title: "Farm Commodities",
      description: "Fresh produce and agricultural products direct from local farms."
    },
    {
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      title: "Electronics",
      description: "Cutting-edge technology and gadgets for your everyday needs."
    },
    {
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      title: "Stationery",
      description: "Quality office and school supplies for all your writing needs."
    },
    {
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
      title: "Real Estates",
      description: "Find your dream property from our extensive listings."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-10 px-4 sm:px-6 lg:px-28 mx-4 md:mx-28 overflow-hidden sm:py-16 lg:py-24 xl:py-32 mt-10 rounded-lg bg-white">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={index}
            className={`object-cover w-full h-full absolute transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            src={slide.image}
            alt={`${slide.title} Category`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {slides[currentSlide].title}
          </h2>
          <p className="mt-4 text-base text-gray-200">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
