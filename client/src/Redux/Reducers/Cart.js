import {
  ADD_ITEM_TO_CART,
  REMOVE_ITEM_FROM_CART,
  CART_SAVE_SHIPPING_ADDRESS,
  SAVE_PAYMENT_METHOD,
  FETCH_CART_ITEMS_REQUEST,
  FETCH_CART_ITEMS_SUCCESS,
  FETCH_CART_ITEMS_FAIL,
  RESET_CART,
  CART_ITEM_CLEAR,
  UPDATE_CART_ITEM_QUANTITY,
  CART_ERROR
} from '../Constants/Cart';

// Get saved data from localStorage
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : null;

const initialState = {
  cartItems: [],
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  loading: false,
  error: null,
  cartTotals: {
    itemsCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = (items) => {
  const itemsCount = items.reduce((total, item) => total + item.qty, 0);
  const subtotal = items.reduce((total, item) => 
    total + (item.productId.price * item.qty), 0);
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.10; // 10% tax
  
  return {
    itemsCount,
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat((subtotal + shipping + tax).toFixed(2))
  };
};

export const cartReducer = (state = initialState, action) => {
  console.log('Reducer Action:', action.type);
  console.log('Action Payload:', action.payload);

  switch (action.type) {
    case FETCH_CART_ITEMS_REQUEST:
      console.log('Fetching cart items...');
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CART_ITEMS_SUCCESS:
      console.log('Cart Items Fetched:', action.payload);
      return {
        ...state,
        loading: false,
        cartItems: action.payload,
        cartTotals: calculateCartTotals(action.payload),
        error: null
      };

    case FETCH_CART_ITEMS_FAIL:
      return {
        ...state,
        loading: false,
        cartItems: [],
        error: action.payload
      };

    case ADD_ITEM_TO_CART:
      const item = action.payload;
      const existItem = state.cartItems.find(x => x._id === item._id);
      
      let updatedCartItems;
      if (existItem) {
        updatedCartItems = state.cartItems.map(x =>
          x._id === existItem._id ? item : x
        );
      } else {
        updatedCartItems = [...state.cartItems, item];
      }

      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotals: calculateCartTotals(updatedCartItems),
        error: null
      };

    case REMOVE_ITEM_FROM_CART:
      const filteredItems = state.cartItems.filter(x => x._id !== action.payload);
      return {
        ...state,
        cartItems: filteredItems,
        cartTotals: calculateCartTotals(filteredItems),
        error: null
      };

    case UPDATE_CART_ITEM_QUANTITY:
      const updatedItems = state.cartItems.map(item =>
        item._id === action.payload._id ? action.payload : item
      );
      return {
        ...state,
        cartItems: updatedItems,
        cartTotals: calculateCartTotals(updatedItems),
        error: null
      };

    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
        error: null
      };

    case SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
        error: null
      };

    case CART_ITEM_CLEAR:
      return {
        ...state,
        cartItems: [],
        cartTotals: calculateCartTotals([]),
        error: null
      };

    case RESET_CART:
      return {
        ...initialState,
        cartItems: [],
        shippingAddress: {},
        paymentMethod: null,
        cartTotals: calculateCartTotals([])
      };

    case CART_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};