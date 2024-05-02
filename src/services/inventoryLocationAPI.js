import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const inventoryLocationAPI = {
  fetchInventoryLocations: async (queryString) => {
    const url = buildApiUrl("/inventoryLocations", queryString);
    return await get(url);
  },

  fetchInventoryLocation: async (queryString) => {
    const url = buildApiUrl("/inventoryLocations", queryString);
    return await get(url);
  },

  createInventoryLocation: async (data) => {
    const url = buildApiUrl("/inventoryLocations");
    return await post(url, data);
  },

  updateInventoryLocation: async (queryString, data) => {
    const url = buildApiUrl("/inventoryLocations", queryString);
    return await put(url, data);
  },

  deleteInventoryLocation: async (queryString) => {
    const url = buildApiUrl("/inventoryLocations", queryString);
    return await del(url);
  },

  searchInventoryLocations: async (query) => {
    const url = buildApiUrl("/search/inventoryLocations");
    return await post(url, query);
  },
};
