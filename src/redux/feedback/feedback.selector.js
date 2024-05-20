export const selectFeedbacks = (state) => (state.feedback ? state.feedback.feedbacks : []);
export const selectFeedback = (state) => (state.feedback ? state.feedback.feedback : null);
