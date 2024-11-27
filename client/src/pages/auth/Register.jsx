import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { userRegisterAction } from "../../Redux/Actions/User";
import Layout from "../../Layouts/Layouts";
import { TbProgress } from "react-icons/tb";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const userRegisterReducer = useSelector((state) => state.userRegisterReducer);
  const { loading, error } = userRegisterReducer;
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userRegisterAction(name, email, phone, password));
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="space-y-2 text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">Create Account</h2>
            <p className="text-sm text-neutral-500">Enter your details to register</p>
          </div>
          
          {loading && (
            <div className="flex items-center justify-center py-4">
              <TbProgress size={32} className="animate-spin text-primary mr-3" />
              <span className="text-neutral-600">Loading...</span>
            </div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-200" 
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  className="w-full px-4 py-2 pl-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>            
            
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
              <PhoneInput
                country={'mw'} 
                value={phone}
                onChange={setPhone}
                inputStyle={{
                  width: '100%',
                  padding: '0.5rem 1rem 0.5rem 3rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
                containerStyle={{
                  marginBottom: '5px',
                }}
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Create a strong password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-600">
              <Link to="/login" className="text-primary hover:underline">
                Already have an account?
              </Link>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Create Account
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

// Add these Tailwind CSS custom classes
const customClasses = `
  .bg-primary { @apply bg-blue-600; }
  .text-primary { @apply text-blue-600; }
  .ring-primary { @apply ring-blue-600; }
  .hover\:bg-primary\/90:hover { @apply bg-blue-700; }
`;