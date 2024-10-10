import axios from 'axios';
import {
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CART_SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
  FETCH_CART_ITEMS_REQUEST,
  FETCH_CART_ITEMS_SUCCESS,
  FETCH_CART_ITEMS_FAIL,
  RESET_CART,
  CART_ITEM_CLEAR
} from '../Constants/Cart';
import { BASE_URL } from '../Constants/BASE_URL';

export const fetchCartItemsAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_ITEMS_REQUEST });
    
    const { data } = await axios.get(`${BASE_URL}/api/cart/${userId}`);
    
    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CART_ITEMS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};

export const addToCartAction = (userId, productId, qty) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/cart/${userId}`, { productId, qty });
    dispatch({
      type: ADD_ITEM_TO_CART,
      payload: data,
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
  }
};

export const removeFromCartAction = (userId, productId) => async (dispatch) => {
  try {
    await axios.delete(`${BASE_URL}/api/cart/${userId}?productId=${productId}`);
    dispatch({
      type: REMOVE_ITEM_FROM_CART,
      payload: productId,
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
  }
};

export const saveShippingAddressAction = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethodAction = (data) => (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_METHOD,
    payload: data,
  });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

export const resetCartAction = () => (dispatch) => {
  dispatch({ type: RESET_CART });
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');
};

export const clearCartItems = () => (dispatch) => {
    dispatch({ type: CART_ITEM_CLEAR });
    localStorage.removeItem('cartItems');
  };

