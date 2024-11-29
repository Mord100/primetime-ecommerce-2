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
import { orderAction, payOrder } from "../Redux/Actions/Order";
import { saveShippingAddressAction, clearCartItems } from "../Redux/Actions/Cart";
import { ORDER_RESET } from "../Redux/Constants/Order";
import toast from 'react-hot-toast'; // Import toast

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

  // Format price helper function - handle any input
  const formatPrice = (price) => {
    try {
      if (price === null || price === undefined) {
        return 0;
      }
      if (typeof price === 'string') {
        return Number(price.replace(/[^0-9.-]+/g, '')) || 0;
      }
      return Number(price) || 0;
    } catch (error) {
      console.error('Error formatting price:', price, error);
      return 0;
    }
  };

  const addDecimal = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const subtotal = addDecimal(cartItems.reduce((total, item) => {
    const itemPrice = formatPrice(item.productId.price); // Ensure item price is a number
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
      navigate(`/order/${order._id}`);
    }

    // Load jQuery first
    const jQueryScript = document.createElement('script');
    jQueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jQueryScript.async = true;
    document.body.appendChild(jQueryScript);

    jQueryScript.onload = () => {
      // After jQuery loads, load Paychangu
      const paychanguScript = document.createElement('script');
      paychanguScript.src = 'https://in.paychangu.com/js/popup.js';
      paychanguScript.async = true;
      document.body.appendChild(paychanguScript);
      
      paychanguScript.onload = () => {
        console.log("Paychangu script loaded successfully");
      };
      
      paychanguScript.onerror = () => {
        console.error("Failed to load Paychangu script");
      };
    };

    return () => {
      const scripts = document.querySelectorAll('script[src*="paychangu"], script[src*="jquery"]');
      scripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      });
    };
  }, [dispatch, success, order, navigate]);

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
      // Validate shipping address
      if (!cart.shippingAddress || !cart.shippingAddress.address) {
        toast.error("Please enter shipping address");
        return;
      }

      // Validate cart items
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Create shipping address object
      const shippingAddress = {
        address: address || cart.shippingAddress.address || '',
        city: city || cart.shippingAddress.city || '',
        postalCode: postalCode || cart.shippingAddress.postalCode || '',
        country: country || cart.shippingAddress.country || ''
      };

      // Ensure all shipping address fields are filled
      if (!shippingAddress.address || !shippingAddress.city || 
          !shippingAddress.postalCode || !shippingAddress.country) {
        toast.error("Please fill in all shipping address fields");
        return;
      }

      // Calculate prices with proper formatting
      const itemsSubtotal = cartItems.reduce((acc, item) => {
        const price = formatPrice(item.productId?.price);
        return acc + (price * (Number(item.qty) || 1));
      }, 0);

      const calculatedTax = itemsSubtotal * 0.10;
      const calculatedShipping = itemsSubtotal > 100 ? 0 : 10;
      const calculatedTotal = itemsSubtotal + calculatedTax + calculatedShipping;

      const orderData = {
        orderItems: cartItems.map(item => ({
          productId: {
            ...item.productId,
            price: formatPrice(item.productId?.price),
            image: Array.isArray(item.productId.image) ? item.productId.image[0] : (item.productId.image || '')
          },
          qty: Number(item.qty) || 1
        })),
        shippingAddress,
        paymentMethod: "paychangu",
        totalPrice: Number(calculatedTotal.toFixed(2)),
        price: Number(itemsSubtotal.toFixed(2)),
        taxPrice: Number(calculatedTax.toFixed(2)),
        shippingPrice: Number(calculatedShipping.toFixed(2))
      };

      console.log('Sending order data:', orderData);

      const createdOrder = await dispatch(orderAction(orderData));

      if (!createdOrder || !createdOrder._id) {
        throw new Error("Failed to create order");
      }

      if (typeof window !== 'undefined' && window.PaychanguCheckout) {
        // Ensure amount is within acceptable range (1-999999)
        const amount = Math.min(Math.max(calculatedTotal, 1), 999999);
        const formattedAmount = Number(amount).toFixed(2);
        
        window.PaychanguCheckout({
          "public_key": "pub-test-JBFl7iideQQSFrZ0YaDFsHGaGquDQJzX",
          "tx_ref": `order_${createdOrder._id}_${Date.now()}`,
          "amount": formattedAmount,
          "currency": "MWK",
          "callback_url": `${window.location.origin}/order/${createdOrder._id}`,
          "return_url": `${window.location.origin}/order/${createdOrder._id}`,
          "customer": {
            "email": "chingolo265@gmail.com",
            "first_name": "Mordecai",
            "last_name": "Chingolo",
          },
          "customization": {
            "title": "Order Payment",
            "description": `Payment for order #${createdOrder._id}`,
          },
          "meta": {
            "orderId": createdOrder._id,
            "amount": formattedAmount,
            "currency": "MWK"
          },
          "onClose": function() {
            console.log("Payment window closed");
          },
          "onSuccess": async function(response) {
            try {
              await dispatch(payOrder(createdOrder._id, {
                id: response.transaction_id,
                status: response.status,
                update_time: new Date().toISOString(),
                email: response.customer.email
              }));
              
              // Clear cart after successful payment
              dispatch(clearCartItems());
              
              toast.success("Payment successful!");
              navigate(`/order/${createdOrder._id}`);
            } catch (error) {
              console.error("Error updating payment:", error);
              toast.error("Payment recorded but order update failed. Please contact support.");
            }
          },
          "onError": function(error) {
            console.error("Payment error:", error);
            toast.error("Payment failed. Please try again.");
          }
        });
      } else {
        throw new Error("PaychanguCheckout is not available");
      }
    } catch (error) {
      console.error("Error creating order or initiating Paychangu checkout:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create order";
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto my-20 px-4 sm:px-6 md:px-32">
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
