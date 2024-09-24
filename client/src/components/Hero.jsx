import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

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
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative h-[600px] overflow-hidden rounded-b-lg">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentSlide}
          src={slides[currentSlide].image}
          alt={`${slides[currentSlide].title} Category`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>

      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-32">
        <div className="max-w-lg">
          <motion.h2
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-semibold text-white font-bebas sm:text-5xl lg:text-6xl"
          >
            {slides[currentSlide].title}
          </motion.h2>
          <motion.p
            key={`description-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-xl text-gray-200"
          >
            {slides[currentSlide].description}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Explore Now
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-lg transition-colors ${
              index === currentSlide ? 'bg-[#f24c1c]' : 'bg-gray-200'
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>

      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-[#00315a] bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[#00315a] bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
      >
        <ChevronRightIcon size={24} />
      </button> */}
    </section>
  )
}

export default Hero