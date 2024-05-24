import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const categoryAPI = {
  fetchCategories: async (queryString) => {
    const url = buildApiUrl("/categories", queryString);
    return await get(url);
  },

  fetchCategory: async (queryString) => {
    const url = buildApiUrl("/categories", queryString);
    return await get(url);
  },

  createCategory: async (data) => {
    const url = buildApiUrl("/categories");
    return await post(url, data);
  },

  updateCategory: async (queryString, data) => {
    const url = buildApiUrl("/categories", queryString);
    return await put(url, data);
  },

  deleteCategory: async (queryString) => {
    const url = buildApiUrl("/categories", queryString);
    return await del(url);
  },

  searchCategories: async (query) => {
    const url = buildApiUrl("/search/categories");
    return await post(url, query);
  },
};
