import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const accountAPI = {
  fetchAccounts: async (query) => {
    const url = buildApiUrl("/accounts", query);
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

  fetchAccount: async (params) => {
    const url = buildApiUrl("/accounts", params);
    return await get(url);
  },

  createAccount: async (data) => {
    const url = buildApiUrl("/accounts");
    return await post(url, data);
  },

  updateAccount: async (params, data) => {
    const url = buildApiUrl("/accounts", params);
    return await put(url, data);
  },

  deleteAccount: async (params) => {
    const url = buildApiUrl("/accounts", params);
    return await del(url);
  },

  searchAccounts: async (query) => {
    const url = buildApiUrl("/search/accounts");
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
