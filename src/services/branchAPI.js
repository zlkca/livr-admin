import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const branchAPI = {
  fetchBranches: async (query) => {
    const url = buildApiUrl("/branches", query);
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
