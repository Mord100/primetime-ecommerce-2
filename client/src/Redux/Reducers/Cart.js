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
  
  const initialState = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: null,
    loading: false,
    error: null
  };
  
  export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CART_ITEMS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case FETCH_CART_ITEMS_SUCCESS:
        return {
          ...state,
          loading: false,
          cartItems: action.payload,
          error: null
        };
      case FETCH_CART_ITEMS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case ADD_ITEM_TO_CART:
        const item = action.payload;
        const existItem = state.cartItems.find((x) => x.product === item.product);
        if (existItem) {
          return {
            ...state,
            cartItems: state.cartItems.map((x) =>
              x.product === existItem.product ? item : x
            ),
          };
        } else {
          return {
            ...state,
            cartItems: [...state.cartItems, item],
          };
        }
      case REMOVE_ITEM_FROM_CART:
        return {
          ...state,
          cartItems: state.cartItems.filter((x) => x.product !== action.payload),
        };
      case CART_SAVE_SHIPPING_ADDRESS:
        return {
          ...state,
          shippingAddress: action.payload
        };
      case SAVE_PAYMENT_METHOD:
        return {
          ...state,
          paymentMethod: action.payload
        };
        case CART_ITEM_CLEAR:
            return {
              ...state,
              cartItems: []
            };
            
          default:
            return state;

        
    }
  };