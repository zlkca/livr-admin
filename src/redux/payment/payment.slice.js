import { createSlice } from "@reduxjs/toolkit";

export const initialPaymentState = {
  payment: null,
  payments: [],
  loading: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState: initialPaymentState,
  reducers: {
    fetchPayments: (state) => {},
    setPayments: (state, action) => {
      state.loading = false;
      state.payments = action.payload;
    },
    fetchPayment: (state) => {},
    setPayment: (state, action) => {
      state.loading = false;
      state.payment = action.payload;
    },
  },
});

export const { fetchPayments, setPayments, fetchPayment, setPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
