const initialState = {
  products: [],
  loading: false,
  error: null,
};

export const productListReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQ_SUCCESS:
      return {
        ...state,
        products: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
      };
    // ... other cases
    default:
      return state;
  }
};