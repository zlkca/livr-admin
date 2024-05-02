import { createSlice } from "@reduxjs/toolkit";

export const initialInventoryState = {
  inventoryStocks: [],
  inventoryStock: null,

  inventoryLocations: [],
  inventoryLocation: null,

  inventoryTransactions: [],
  inventoryTransaction: null,
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState: initialInventoryState,
  reducers: {
    setInventoryStocks: (state, action) => {
      state.loading = false;
      state.inventoryStocks = action.payload;
    },
    setInventoryStock: (state, action) => {
      state.loading = false;
      state.inventoryStock = action.payload;
    },

    setInventoryLocations: (state, action) => {
      state.loading = false;
      state.inventoryLocations = action.payload;
    },
    setInventoryLocation: (state, action) => {
      state.loading = false;
      state.inventoryLocation = action.payload;
    },

    setInventoryTransactions: (state, action) => {
      state.loading = false;
      state.inventoryTransactions = action.payload;
    },
    setInventoryTransaction: (state, action) => {
      state.loading = false;
      state.inventoryTransaction = action.payload;
    },
  },
});

export const {
  setInventoryStocks,
  setInventoryStock,

  setInventoryLocations,
  setInventoryLocation,

  setInventoryTransactions,
  setInventoryTransaction,
} = inventorySlice.actions;

export default inventorySlice.reducer;
