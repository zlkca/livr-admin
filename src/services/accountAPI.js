import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const accountAPI = {
  fetchAccounts: async (query) => {
    const url = buildApiUrl("/accounts", query);
    return await get(url);
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
    return await post(url, query);
  },
};
