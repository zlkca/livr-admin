import { createSlice } from "@reduxjs/toolkit";
import { accountThunkReducers } from "./account.thunk";

export const initialAccountState = {
  accounts: [],
  account: null,
  selectedAccountId: null,

  clients: [],
  client: null,
  employees: [],
  employee: null,
  partner: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState: initialAccountState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setClient: (state, action) => {
      state.client = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    setPartner: (state, action) => {
      state.partner = action.payload;
    },
  },
  extraReducers: accountThunkReducers,
});

export const { setAccounts, setClients, setClient, setEmployees, setEmployee, setPartner } =
  accountSlice.actions;

export default accountSlice.reducer;
