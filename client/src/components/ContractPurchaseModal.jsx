import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign } from 'react-icons/fi'
import { FaRegIdCard } from "react-icons/fa";
// import {FiMapPin} from 'react-icons/fi'
import PhoneInput from "react-phone-input-2";

const ContractPurchaseModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    nationid: "",
    financingOption: '',
    idCardImage: '', 
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    if (e.target.name === 'idCardImage') {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFormData({ ...formData, idCardImage: e.target.result });
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formData,
        'YOUR_USER_ID'
      )
      toast.success('Contract purchase request sent successfully!')
      onClose()
    } catch (error) {
      console.error('Error sending contract purchase request:', error)
      toast.error('Failed to send contract purchase request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white p-8 rounded-lg max-w-xl w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Contract Purchase</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" 
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" 
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <PhoneInput
                  country={"mw"}
                  value={formData.phone} // Bind the phone number to formData
                  onChange={(phone) => setFormData({ ...formData, phone })} // Update formData on change
                  inputStyle={{
                    width: "93%",
                    padding: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginLeft: "35px",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="idCardImage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  National ID Card Image
                </label>
                <div className="relative">
                  <FaRegIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="file"
                    id="idCardImage"
                    name="idCardImage"
                    onChange={handleImageChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <textarea 
                    id="address" 
                    name="address" 
                    rows="3" 
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    required
                  ></textarea>
                </div>
              </div>
              <div>
                <label htmlFor="financingOption" className="block text-sm font-medium text-gray-700 mb-1">Financing Option</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    id="financingOption" 
                    name="financingOption" 
                    value={formData.financingOption}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out appearance-none"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="fullPayment">Full Payment</option>
                    <option value="12months">12 Months Financing</option>
                    <option value="24months">24 Months Financing</option>
                    <option value="36months">36 Months Financing</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#f24c1c] text-white rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </AnimatePresence>
  )
}

export default ContractPurchaseModal