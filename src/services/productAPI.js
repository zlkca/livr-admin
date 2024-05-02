import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const productAPI = {
  fetchProducts: async (queryString) => {
    const url = buildApiUrl("/products", queryString);
    return await get(url);
  },

  fetchProduct: async (queryString) => {
    const url = buildApiUrl("/products", queryString);
    return await get(url);
  },

  createProduct: async (data) => {
    const url = buildApiUrl("/products");
    return await post(url, data);
  },

  updateProduct: async (queryString, data) => {
    const url = buildApiUrl("/products", queryString);
    return await put(url, data);
  },

  deleteProduct: async (queryString) => {
    const url = buildApiUrl("/products", queryString);
    return await del(url);
  },

  searchProducts: async (query) => {
    const url = buildApiUrl("/search/products");
    return await post(url, query);
  },
};
