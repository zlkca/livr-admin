import { createSlice } from "@reduxjs/toolkit";

export const initialOrderState = {
  order: null,
  orders: [],
  loading: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState: initialOrderState,
  reducers: {
    fetchOrders: (state) => {},
    setOrders: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrder: (state) => {},
    setOrder: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
  },
});

export const { fetchOrders, setOrders, fetchOrder, setOrder } = orderSlice.actions;

export default orderSlice.reducer;
