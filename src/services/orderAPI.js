import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const orderAPI = {
  fetchOrders: async (query) => {
    const url = buildApiUrl("/orders", query);
    const rsp = await get(url);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        created: moment.utc(it.created).local().format("yyyy-MM-DD hh:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD hh:mm:ss"),
      }));
    }
    return { ...rsp, data };
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
    const rsp = await post(url, query);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        created: moment.utc(it.created).local().format("yyyy-MM-DD hh:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD hh:mm:ss"),
      }));
    }
    return { ...rsp, data };
  },
};
