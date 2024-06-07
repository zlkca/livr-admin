import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const supplierAPI = {
  fetchSuppliers: async (queryString) => {
    const url = buildApiUrl("/suppliers", queryString);
    return await get(url);
  },

  fetchSupplier: async (queryString) => {
    const url = buildApiUrl("/suppliers", queryString);
    return await get(url);
  },

  createSupplier: async (data) => {
    const url = buildApiUrl("/suppliers");
    return await post(url, data);
  },

  updateSupplier: async (queryString, data) => {
    const url = buildApiUrl("/suppliers", queryString);
    return await put(url, data);
  },

  deleteSupplier: async (queryString) => {
    const url = buildApiUrl("/suppliers", queryString);
    return await del(url);
  },

  searchSuppliers: async (query) => {
    const url = buildApiUrl("/search/suppliers");
    return await post(url, query);
  },
};
