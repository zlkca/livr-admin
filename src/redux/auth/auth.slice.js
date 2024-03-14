import { createSlice } from "@reduxjs/toolkit";
// import { authThunkReducers } from './auth.thunk.js'

export const initialAuthState = {
  tokenId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setTokenId: (state, action) => {
      state.tokenId = action.payload;
    },
    setSignedInUser: (state, action) => {
      state.signedInUser = action.payload;
    },
  },
  // extraReducers: authThunkReducers
});

export const { setTokenId, setSignedInUser } = authSlice.actions;

export default authSlice.reducer;
