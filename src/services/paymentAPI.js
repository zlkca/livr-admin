import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const paymentAPI = {
  fetchPayments: async (query) => {
    const url = buildApiUrl("/payments", query);
    const rsp = await get(url);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        created: moment.utc(it.created).local().format("yyyy-MM-DD HH:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD HH:mm:ss"),
      }));
    }
    return { ...rsp, data };
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
    const rsp = await post(url, query);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        created: moment.utc(it.created).local().format("yyyy-MM-DD HH:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD HH:mm:ss"),
      }));
    }
    return { ...rsp, data };
  },
};
