import {
    ADD_ITEM_TO_CART,
    REMOVE_ITEM_FROM_CART,
    CART_SAVE_SHIPPING_ADDRESS,
    SAVE_PAYMENT_METHOD,
    FETCH_CART_ITEMS,
    RESET_CART
} from '../Constants/Cart';

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case FETCH_CART_ITEMS:
            return {
                ...state,
                cartItems: action.payload,
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
            return { ...state, shippingAddress: action.payload };
        case SAVE_PAYMENT_METHOD:
            return { ...state, paymentMethod: action.payload };
        case RESET_CART:
            return { cartItems: [], shippingAddress: {} }; 
        default:
            return state;
    }
};
