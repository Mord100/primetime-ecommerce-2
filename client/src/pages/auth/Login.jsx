import { useState, useEffect } from "react"
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
  const [timeoutError, setTimeoutError] = useState(null)

  const dispatch = useDispatch()
  const userLoginReducer = useSelector((state) => state.userLoginReducer)
  const { loading, error } = userLoginReducer

  useEffect(() => {
    if (!loading) {
      setTimeoutError(null)
    }
  }, [loading])

  const submitHandler = (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert("Please fill in all fields.")
      return
    }

    setTimeoutError(null)
    dispatch(userLoginAction(email, password))

    setTimeout(() => {
      if (loading && !error) {
        setTimeoutError("Connection timeout. Please try again.")
      }
    }, 5000)
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen mb-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-xl p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm"
        >
          <div className="space-y-2 text-center mb-8">
            <h2 className="text-3xl font-semibold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-neutral-500">Sign in to your account</p>
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

          {timeoutError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-50 text-yellow-600 p-3 rounded-lg mb-6 text-center border border-yellow-200"
            >
              {timeoutError}
            </motion.div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Enter your password"
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
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
              <Link to="/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Sign In
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  )
}

// Add these Tailwind CSS custom classes
const customClasses = `
  .bg-primary { @apply bg-blue-600; }
  .text-primary { @apply text-blue-600; }
  .ring-primary { @apply ring-blue-600; }
  .hover\:bg-primary\/90:hover { @apply bg-blue-700; }
`;