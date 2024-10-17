import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { FiTruck, FiCreditCard, FiShoppingBag } from "react-icons/fi";
import Layout from "../Layouts/Layouts";
import CartItem from "../components/CartItem";
import { BASE_URL } from "../Redux/Constants/BASE_URL";
import { orderAction, orderPaymentAction } from "../Redux/Actions/Order";
import { saveShippingAddressAction } from "../Redux/Actions/Cart";
import { ORDER_RESET } from "../Redux/Constants/Order";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartReducer);
  const { cartItems = [], shippingAddress } = cart; // Default to empty array
  const orderReducer = useSelector((state) => state.orderReducer);
  const { order, success } = orderReducer;

  const [paymentResult, setPaymentResult] = useState({});
  const [clientId, setClientId] = useState(null);
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const addDecimal = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const subtotal = addDecimal(cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.productId?.price) || 0; // Ensure item price is a number
    return total + (item.qty * itemPrice);
  }, 0));
  const taxPrice = addDecimal(Number(0.15 * subtotal).toFixed(2));
  const shippingPrice = addDecimal(subtotal > 100 ? 0 : 20);
  const total = addDecimal(Number(subtotal) + Number(taxPrice) + Number(shippingPrice));

  useEffect(() => {
    const getPaypalClientID = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/config/paypal`);
        setClientId(data);
      } catch (error) {
        console.error("Failed to fetch PayPal client ID:", error);
      }
    };

    getPaypalClientID();

    if (success) {
      dispatch({ type: ORDER_RESET });
      dispatch(orderPaymentAction(order._id, paymentResult));
      navigate(`/order/${order._id}`);
    }

    const script = document.createElement('script');
    script.src = 'https://in.paychangu.com/js/popup.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      console.log("Paychangu script loaded successfully");
    };
    
    script.onerror = () => {
      console.log("Failed to load Paychangu script");
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [dispatch, success, order, paymentResult, navigate]);

  const successPaymentHandler = async (details) => {
    try {
      setPaymentResult(details);
      dispatch(orderAction({
        orderItems: cartItems,
        shippingAddress: cart.shippingAddress,
        totalPrice: total,
        paymentMethod: "paypal",
        price: subtotal,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
      }));
    } catch (err) {
      console.error("Payment processing error:", err);
    }
  };

  const saveShippingAddress = () => {
    dispatch(saveShippingAddressAction({ address, city, postalCode, country }));
  };

  const handlePaychangu = async () => {
    try {
      const createdOrder = await dispatch(orderAction({
        orderItems: cartItems,
        shippingAddress: cart.shippingAddress,
        totalPrice: total,
        paymentMethod: "paychangu",
        price: subtotal,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
      }));

      if (typeof window !== 'undefined' && window.PaychanguCheckout) {
        window.PaychanguCheckout({
          "public_key": "pub-test-JBFl7iideQQSFrZ0YaDFsHGaGquDQJzX",
          "tx_ref": '' + Math.floor((Math.random() * 1000000000) + 1),
          "amount": parseFloat(total),
          "currency": "MWK",
          "callback_url": `http://localhost:5173/order/${createdOrder._id}`,
          "return_url": `http://localhost:5173/order/${createdOrder._id}`,
          "customer": {
            "email": "chingolo265@gmail.com",
            "first_name": "Mordecai",
            "last_name": "Chingolo",
          },
          "customization": {
            "title": "Order Payment",
            "description": "Payment for your order",
          },
          "meta": {
            "uuid": "uuid",
            "response": "Response"
          }
        });
      } else {
        console.error("PaychanguCheckout is not available");
      }
    } catch (error) {
      console.error("Error creating order or initiating Paychangu checkout:", error);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                  <FiShoppingBag className="mr-2" />
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <CartItem cartItems={cartItems} />
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">MWK{subtotal.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">MWK{taxPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">MWK{shippingPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">MWK{total.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 bg-gray-50 p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                  <FiTruck className="mr-2" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveShippingAddress}
                  className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  Save Address
                </motion.button>

                <div className="mt-8 space-y-4">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Methods
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePaychangu}
                    className="w-full bg-[#00b9fc] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out"
                  >
                    Pay with Paychangu
                  </motion.button>

                  {clientId && (
                    <PayPalScriptProvider options={{ clientId: clientId }}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: total,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then(successPaymentHandler);
                        }}
                        style={{ layout: "vertical" }}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
