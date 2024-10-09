import axios from 'axios';
import {
    ADD_ITEM_TO_CART,
    REMOVE_ITEM_FROM_CART,
    CART_SAVE_SHIPPING_ADDRESS,
    SAVE_PAYMENT_METHOD,
    FETCH_CART_ITEMS,
    RESET_CART
} from '../Constants/Cart';
import { BASE_URL } from '../Constants/BASE_URL';

// Fetch cart items for a specific user
export const fetchCartItemsAction = (userId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/api/cart/${userId}`);
        dispatch({
            type: FETCH_CART_ITEMS,
            payload: data,
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
};

// Add item to cart
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

// Remove item from cart
export const removeFromCartAction = (userId, itemId) => async (dispatch) => {
    try {
        await axios.delete(`${BASE_URL}/api/cart/${userId}/${itemId}`);
        dispatch({
            type: REMOVE_ITEM_FROM_CART,
            payload: itemId,
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
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

// Clear cart when user changes
export const resetCartAction = () => (dispatch) => {
    dispatch({ type: RESET_CART });
};
