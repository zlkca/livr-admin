import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const orderAPI = {
  fetchOrders: async (query) => {
    const url = buildApiUrl("/orders", query);
    return await get(url);
  },

  fetchOrder: async (params) => {
    const url = buildApiUrl("/orders", params);
    return await get(url);
  },

  createOrder: async (data) => {
    const url = buildApiUrl("/orders");
    return await post(url, data);
  },

  updateOrder: async (params, data) => {
    const url = buildApiUrl("/orders", params);
    return await put(url, data);
  },

  deleteOrder: async (params) => {
    const url = buildApiUrl("/orders", params);
    return await del(url);
  },

  searchOrders: async (query) => {
    const url = buildApiUrl("/search/orders");
    return await post(url, query);
  },
};
