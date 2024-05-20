import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const feedbackAPI = {
  fetchFeedbacks: async (queryString) => {
    const url = buildApiUrl("/feedbacks", queryString);
    return await get(url);
  },

  fetchFeedback: async (queryString) => {
    const url = buildApiUrl("/feedbacks", queryString);
    return await get(url);
  },

  createFeedback: async (data) => {
    const url = buildApiUrl("/feedbacks");
    return await post(url, data);
  },

  updateFeedback: async (queryString, data) => {
    const url = buildApiUrl("/feedbacks", queryString);
    return await put(url, data);
  },

  deleteFeedback: async (queryString) => {
    const url = buildApiUrl("/feedbacks", queryString);
    return await del(url);
  },

  searchFeedbacks: async (query) => {
    const url = buildApiUrl("/search/feedbacks");
    return await post(url, query);
  },
};
