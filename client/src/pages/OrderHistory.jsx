import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { FiPackage, FiCalendar, FiDollarSign, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi"
import { TbProgress } from "react-icons/tb"
import moment from "moment"
import Layout from "../Layouts/Layouts"
import { orderListAction } from "../Redux/Actions/Order"
import Select from 'react-select';
import LoadingSpinner from "../components/LoadingSpinner"

export function OrderHistory() {
  const dispatch = useDispatch()
  const [orderType, setOrderType] = useState("All orders")
  const [duration, setDuration] = useState("this week")

  useEffect(() => {
    dispatch(orderListAction())
  }, [dispatch])

  const orderListReducer = useSelector((state) => state.orderListReducer)
  const { orders, loading, error } = orderListReducer

  const orderTypeOptions = [
    { value: "All orders", label: "All orders" },
    { value: "pre-order", label: "Pre-order" },
    { value: "transit", label: "In transit" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const durationOptions = [
    { value: "this week", label: "this week" },
    { value: "this month", label: "this month" },
    { value: "last 3 months", label: "the last 3 months" },
    { value: "last 6 months", label: "the last 6 months" },
    { value: "this year", label: "this year" },
  ];

  const filteredOrders = orders?.filter(order => {
    if (orderType !== "All orders") {
      // Add logic to filter by order type
    }
    if (duration !== "this week") {
      // Add logic to filter by duration
    }
    return true
  })

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-8 sm:py-12"
      >
        <div className="mx-auto px-4 sm:px-6 my-20 lg:px-32">
          <div className="mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Orders</h1>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Select
                  value={orderTypeOptions.find(option => option.value === orderType)}
                  onChange={(option) => setOrderType(option.value)}
                  options={orderTypeOptions}
                  className="w-full sm:w-auto"
                />
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">from</span>
                  <Select
                    value={durationOptions.find(option => option.value === duration)}
                    onChange={(option) => setDuration(option.value)}
                    options={durationOptions}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner/>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            ) : (
              <AnimatePresence>
                {filteredOrders && filteredOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white shadow-md rounded-lg mb-6 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap -mx-4">
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                          <div className="flex items-center">
                            <FiPackage className="text-indigo-600 mr-2" size={20} />
                            <div>
                              <p className="text-sm text-gray-600">Order ID</p>
                              <p className="font-semibold text-gray-900">#{order._id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm text-gray-600">Date</p>
                              <p className="font-semibold text-gray-900">{moment(order.createdAt).format("MMM Do YY")}</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm text-gray-600">Total Price</p>
                              <p className="font-semibold text-gray-900">MWK {order.totalPrice.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
                          <div className="flex items-center">
                            {order.isPaid ? (
                              <FiCheckCircle className="text-green-500 mr-2" size={20} />
                            ) : (
                              <FiXCircle className="text-red-500 mr-2" size={20} />
                            )}
                            <div>
                              <p className="text-sm text-gray-600">Status</p>
                              <p className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                                {order.isPaid ? 'Paid' : 'Not Paid'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FiRefreshCw className="mr-2" size={16} />
                          Order Again
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}