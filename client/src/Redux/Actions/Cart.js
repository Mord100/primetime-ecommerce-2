import axios from 'axios';
import {
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
  CART_SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
  FETCH_CART_ITEMS_REQUEST,
  FETCH_CART_ITEMS_SUCCESS,
  FETCH_CART_ITEMS_FAIL,
  RESET_CART,
  CART_ITEM_CLEAR,
  CART_ERROR
} from '../Constants/Cart';
import { BASE_URL } from '../Constants/BASE_URL';

// Helper function for error handling
const handleError = (error, dispatch) => {
  const errorMessage = error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
  
  dispatch({
    type: CART_ERROR,
    payload: errorMessage,
  });
  return errorMessage;
};

// Fetch cart items
export const fetchCartItemsAction = (userId) => async (dispatch) => {
  try {
    console.log('Fetching cart for userId:', userId);
    dispatch({ type: FETCH_CART_ITEMS_REQUEST });
    
    const { data } = await axios.get(`${BASE_URL}/api/cart/${userId}`);
    
    console.log('API Response:', data);
    
    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error('Cart Fetch Error:', error.response ? error.response.data : error.message);
    dispatch({
      type: FETCH_CART_ITEMS_FAIL,
      payload: handleError(error, dispatch),
    });
  }
};

// Add item to cart
export const addToCartAction = (userId, productId, qty, price) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/cart/${userId}`, {
      productId,
      qty: parseInt(qty),
    });

    dispatch({
      type: ADD_ITEM_TO_CART,
      payload: data,
    });

    // Fetch updated cart after adding item
    dispatch(fetchCartItemsAction(userId));
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Remove item from cart
export const removeFromCartAction = (userId, itemId) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/cart/${userId}/${itemId}`);
    
    dispatch({
      type: REMOVE_ITEM_FROM_CART,
      payload: itemId,
    });

    // Fetch updated cart after removing item
    dispatch(fetchCartItemsAction(userId));
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Update cart item quantity
export const updateCartItemQuantity = (userId, itemId, qty) => async (dispatch) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/api/cart/${userId}/${itemId}`, {
      qty: parseInt(qty),
    });

    dispatch({
      type: UPDATE_CART_ITEM_QUANTITY,
      payload: data,
    });

    // Fetch updated cart after quantity update
    dispatch(fetchCartItemsAction(userId));
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Save shipping address
export const saveShippingAddressAction = (data) => (dispatch) => {
  try {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS,
      payload: data,
    });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Save payment method
export const savePaymentMethodAction = (data) => (dispatch) => {
  try {
    dispatch({
      type: SAVE_PAYMENT_METHOD,
      payload: data,
    });
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Reset cart
export const resetCartAction = () => (dispatch) => {
  try {
    dispatch({ type: RESET_CART });
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  } catch (error) {
    handleError(error, dispatch);
  }
};

// Clear cart items
export const clearCartItems = () => (dispatch) => {
  try {
    dispatch({ type: CART_ITEM_CLEAR });
    localStorage.removeItem('cartItems');
  } catch (error) {
    handleError(error, dispatch);
  }
};