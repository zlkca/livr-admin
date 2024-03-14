import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const projectAPI = {
  fetchProjects: async (query) => {
    const url = buildApiUrl("/projects", query);
    return await get(url);
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
    return await post(url, query);
  },
};
