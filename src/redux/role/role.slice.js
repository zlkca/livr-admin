import { createSlice } from "@reduxjs/toolkit";

export const initialRoleState = {
  roles: [],
  role: null,
  selectedRoleId: null,

  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null,
};

export const roleSlice = createSlice({
  name: "role",
  initialState: initialRoleState,
  reducers: {},
});

export default roleSlice.reducer;
