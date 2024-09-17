import { useDispatch, useSelector } from "react-redux";
import Layout from "../Layouts/Layouts";
import CartItem from "../components/CartItem";
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { BASE_URL } from "../Redux/Constants/BASE_URL";
import { orderAction, orderPaymentAction } from "../Redux/Actions/Order";
import { saveShippingAddressAction } from "../Redux/Actions/Cart";
import { ORDER_RESET } from "../Redux/Constants/Order";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cartReducer);
  const { cartItems, shippingAddress } = cart;
  const orderReducer = useSelector((state) => state.orderReducer);
  const { order, success } = orderReducer;

  const [paymentResult, setPaymentResult] = useState({});
  const [clientId, setClientId] = useState(null);
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const addDecimal = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const subtotal = addDecimal(cartItems.reduce((total, item) => total + item.qty * item.price, 0));
  const taxPrice = addDecimal(Number(0.15 * subtotal).toFixed(2));
  const shippingPrice = addDecimal(subtotal > 100 ? 0 : 20);
  const total = (Number(subtotal) + Number(taxPrice) + Number(shippingPrice)).toFixed(2);

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

    // Load Paychangu script
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
        orderItems: cart.cartItems,
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
      // Create the order first
      const createdOrder = await dispatch(orderAction({
        orderItems: cart.cartItems,
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
          "customer":{
            "email": "chingolo265@gmail.com",
            "first_name":"Mordecai",
            "last_name":"Chingolo",
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
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <CartItem cartItems={cartItems} />
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">MWK{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">MWK{taxPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">MWK{shippingPrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">MWK{total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 bg-gray-50 p-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Shipping Address</h2>
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
                <button
                  onClick={saveShippingAddress}
                  className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Address
                </button>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={handlePaychangu}
                    className="w-full bg-[#00b9fc] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Pay with Paychangu
                  </button>

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
          </div>
        </div>
      </div>
    </Layout>
  );
}