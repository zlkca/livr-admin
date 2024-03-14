import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const paymentAPI = {
  fetchPayments: async (query) => {
    const url = buildApiUrl("/payments", query);
    return await get(url);
  },

  fetchPayment: async (params) => {
    const url = buildApiUrl("/payments", params);
    return await get(url);
  },

  createPayment: async (data) => {
    const url = buildApiUrl("/payments");
    return await post(url, data);
  },

  updatePayment: async (params, data) => {
    const url = buildApiUrl("/payments", params);
    return await put(url, data);
  },

  deletePayment: async (params) => {
    const url = buildApiUrl("/payments", params);
    return await del(url);
  },

  searchPayments: async (query) => {
    const url = buildApiUrl("/search/payments");
    return await post(url, query);
  },
};
