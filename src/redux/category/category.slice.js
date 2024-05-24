import { createSlice } from "@reduxjs/toolkit";

export const initialCategoryState = {
  categories: [],
  category: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState: initialCategoryState,
  reducers: {
    setCategories: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    setCategory: (state, action) => {
      state.loading = false;
      state.category = action.payload;
    },
  },
});

export const { setCategories, setCategory } = categorySlice.actions;

export default categorySlice.reducer;
