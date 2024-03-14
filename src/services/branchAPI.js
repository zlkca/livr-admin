import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const branchAPI = {
  fetchBranches: async (query) => {
    const url = buildApiUrl("/branches", query);
    return await get(url);
  },

  fetchBranch: async (params) => {
    const url = buildApiUrl("/branches", params);
    return await get(url);
  },

  createBranch: async (data) => {
    const url = buildApiUrl("/branches");
    return await post(url, data);
  },

  updateBranch: async (params, data) => {
    const url = buildApiUrl("/branches", params);
    return await put(url, data);
  },

  deleteBranch: async (params) => {
    const url = buildApiUrl("/branches", params);
    return await del(url);
  },

  searchBranches: async (query) => {
    const url = buildApiUrl("/search/branches");
    return await post(url, query);
  },
};
