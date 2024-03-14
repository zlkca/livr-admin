import { createAsyncThunk } from "@reduxjs/toolkit";
import { accountAPI } from "../../services/accountAPI";

export const createAccount = createAsyncThunk("account/createAccount", async (body, thunkAPI) => {
  const rsp = await accountAPI.createAccount(body);
  return rsp.data;
});

export const fetchAccounts = createAsyncThunk("account/fetchAccounts", async (query, thunkAPI) => {
  const rsp = await accountAPI.fetchAccounts(query);
  return rsp.data;
});

export const fetchAccount = createAsyncThunk("account/fetchAccount", async (_id, thunkAPI) => {
  const rsp = await accountAPI.fetchAccount(_id);
  return rsp.data;
});

export const searchAccounts = createAsyncThunk(
  "account/searchAccounts",
  async (query, thunkAPI) => {
    const rsp = await accountAPI.searchAccounts(query);
    return rsp.data;
  }
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ _id, data }, thunkAPI) => {
    const rsp = await accountAPI.updateAccount(_id, data);
    return rsp.data;
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async ({ _id }, thunkAPI) => {
    const rsp = await accountAPI.deleteAccount(_id);
    return rsp.data;
  }
);

export const accountThunkReducers = (builder) => {
  builder
    .addCase(createAccount.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(createAccount.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accounts.push(action.payload);
    })
    .addCase(createAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    })
    .addCase(fetchAccounts.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(fetchAccounts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accounts = action.payload;
    })
    .addCase(fetchAccounts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    })
    .addCase(fetchAccount.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(fetchAccount.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.account = action.payload;
    })
    .addCase(fetchAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    })
    .addCase(searchAccounts.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(searchAccounts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accounts = action.payload;
    })
    .addCase(searchAccounts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    })
    .addCase(updateAccount.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(updateAccount.fulfilled, (state, action) => {
      state.status = "succeeded";
      const index = state.accounts.findIndex((it) => it._id === action.payload._id);

      if (index !== -1) {
        const item = state.accounts[index];
        state.accounts[index] = { ...item, ...action.payload.data };
        state.account = { ...item, ...action.payload.data };
      }
    })
    .addCase(updateAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    })
    .addCase(deleteAccount.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(deleteAccount.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.accounts = state.accounts.filter((it) => it._id !== action.payload._id);
    })
    .addCase(deleteAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error;
    });
};
