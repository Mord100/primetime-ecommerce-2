import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { userLoginAction } from "../../Redux/Actions/User"
import Layout from "../../Layouts/Layouts"
import { TbProgress } from "react-icons/tb"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const userLoginReducer = useSelector((state) => state.userLoginReducer)
  const { loading, error } = userLoginReducer
  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(userLoginAction(email, password))
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
          {loading && (
             <div className="flex items-center justify-center py-2 ">
             <TbProgress size={40} className="animate-spin mr-3 text-[#f24c1c]" />
             <span className="text-xl font-semibold text-gray-700">Loading...</span>
           </div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-700 p-4 rounded-lg mb-6" 
              role="alert"
            >
              <p>{error}</p>
            </motion.div>
          )}
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 focus:outline-none"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 px-4 bg-[#00315a] hover:bg-opacity-90 text-white font-semibold rounded-lg shadow-md "
            >
              Sign in
            </motion.button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}