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
  CART_ERROR,
  CART_CLEAR_ITEMS
} from '../Constants/Cart';

import { BASE_URL } from '../Constants/BASE_URL';

// Error Handling Service
class ErrorHandlingService {
  static handleError(error) {
    if (axios.isAxiosError(error)) {
      return error.response && error.response.data.message
        ? error.response.data.message
        : 'An unexpected error occurred';
    }
    return error.message || 'An unexpected error occurred';
  }
}

// Fetch cart items
export const fetchCartItemsAction = (userId) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CART_ITEMS_REQUEST });
    
    const { data } = await axios.get(`${BASE_URL}/api/cart/${userId}`);
    
    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = ErrorHandlingService.handleError(error);
    dispatch({
      type: FETCH_CART_ITEMS_FAIL,
      payload: errorMessage,
    });
  }
};

// Add item to cart
export const addToCartAction = (userId, productId, qty, price) => async (dispatch) => {
  try {
    // Get current product details from the cart state
    const product = await axios.get(`${BASE_URL}/api/products/${productId}`);
    
    // Optimistic update with full product details
    dispatch({
      type: ADD_ITEM_TO_CART,
      payload: { 
        productId,
        qty,
        product: product.data
      }
    });

    const { data } = await axios.post(`${BASE_URL}/api/cart/${userId}`, {
      productId,
      qty: parseInt(qty),
    });

    // Confirm with server response
    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const errorMessage = ErrorHandlingService.handleError(error);
    dispatch({
      type: CART_ERROR,
      payload: errorMessage,
    });
  }
};

// Remove item from cart
export const removeFromCartAction = (userId, itemId) => async (dispatch) => {
  try {
    // Optimistic update
    dispatch({
      type: REMOVE_ITEM_FROM_CART,
      payload: itemId,
    });

    await axios.delete(`${BASE_URL}/api/cart/${userId}/${itemId}`);

    // Fetch updated cart to ensure consistency
    dispatch(fetchCartItemsAction(userId));
  } catch (error) {
    const errorMessage = ErrorHandlingService.handleError(error);
    dispatch({
      type: CART_ERROR,
      payload: errorMessage,
    });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = (userId, itemId, qty) => async (dispatch) => {
  try {
    // Optimistic update
    dispatch({
      type: UPDATE_CART_ITEM_QUANTITY,
      payload: { _id: itemId, qty }
    });

    const { data } = await axios.put(`${BASE_URL}/api/cart/${userId}/${itemId}`, {
      qty: parseInt(qty)
    });

    // Confirm with server response
    dispatch({
      type: FETCH_CART_ITEMS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    // Rollback on error
    const errorMessage = ErrorHandlingService.handleError(error);
    dispatch({
      type: CART_ERROR,
      payload: errorMessage,
    });
    dispatch(fetchCartItemsAction(userId));
  }
};

// Save shipping address
export const saveShippingAddressAction = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

// Save payment method
export const savePaymentMethodAction = (data) => (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_METHOD,
    payload: data,
  });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};

// Reset cart
export const resetCartAction = () => (dispatch) => {
  dispatch({ type: RESET_CART });
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');
};

// Clear cart items
export const clearCartItems = () => (dispatch) => {
  dispatch({ type: CART_ITEM_CLEAR });
  localStorage.removeItem('cartItems');
};

// Clear cart
export const clearCart = () => (dispatch) => {
  dispatch({ type: CART_ITEM_CLEAR });
  localStorage.removeItem("cartItems");
};