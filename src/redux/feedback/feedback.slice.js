import { createSlice } from "@reduxjs/toolkit";

export const initialFeedbackState = {
  feedbacks: [],
  feedback: null,
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState: initialFeedbackState,
  reducers: {
    setFeedbacks: (state, action) => {
      state.loading = false;
      state.feedbacks = action.payload;
    },
    setFeedback: (state, action) => {
      state.loading = false;
      state.feedback = action.payload;
    },
  },
});

export const { setFeedbacks, setFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;
