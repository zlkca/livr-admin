import { createSlice } from "@reduxjs/toolkit";

export const initialSupplierState = {
  suppliers: [],
  supplier: null,
};

export const supplierSlice = createSlice({
  name: "supplier",
  initialState: initialSupplierState,
  reducers: {
    setSuppliers: (state, action) => {
      state.loading = false;
      state.suppliers = action.payload;
    },
    setSupplier: (state, action) => {
      state.loading = false;
      state.supplier = action.payload;
    },
  },
});

export const { setSuppliers, setSupplier } = supplierSlice.actions;

export default supplierSlice.reducer;
