import { createSlice } from "@reduxjs/toolkit";

export const initialProductState = {
  products: [],
  product: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState: initialProductState,
  reducers: {
    setProducts: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
  },
});

export const { setProducts, setProduct } = productSlice.actions;

export default productSlice.reducer;
