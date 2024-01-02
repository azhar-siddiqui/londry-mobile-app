import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "../slices/CartReducer";
import ProductReducer from "../slices/ProductReducer";

export default configureStore({
  reducer: {
    cart: CartReducer,
    product: ProductReducer,
  },
});
