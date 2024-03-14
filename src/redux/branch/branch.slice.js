import { createSlice } from "@reduxjs/toolkit";

export const initialBranchState = {
  branch: null,
  branches: [],
  loading: false,
};

export const branchSlice = createSlice({
  name: "branch",
  initialState: initialBranchState,
  reducers: {
    fetchBranches: (state) => {},
    setBranches: (state, action) => {
      state.loading = false;
      state.branches = action.payload;
    },
    fetchBranch: (state) => {},
    setBranch: (state, action) => {
      state.loading = false;
      state.branch = action.payload;
    },
  },
});

export const { fetchBranches, setBranches, fetchBranch, setBranch } = branchSlice.actions;

export default branchSlice.reducer;
