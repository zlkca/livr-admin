import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const projectAPI = {
  fetchProjects: async (query) => {
    const url = buildApiUrl("/projects", query);
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

  fetchProject: async (params) => {
    const url = buildApiUrl("/projects", params);
    return await get(url);
  },

  createProject: async (data) => {
    const url = buildApiUrl("/projects");
    return await post(url, data);
  },

  updateProject: async (params, data) => {
    const url = buildApiUrl("/projects", params);
    return await put(url, data);
  },

  deleteProject: async (params) => {
    const url = buildApiUrl("/projects", params);
    return await del(url);
  },

  searchProjects: async (query) => {
    const url = buildApiUrl("/search/projects");
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
