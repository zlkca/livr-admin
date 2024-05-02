import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const inventoryStockAPI = {
  fetchInventoryStocks: async (queryString) => {
    const url = buildApiUrl("/inventoryStocks", queryString);
    return await get(url);
  },

  fetchInventoryStock: async (queryString) => {
    const url = buildApiUrl("/inventoryStocks", queryString);
    return await get(url);
  },

  createInventoryStock: async (data) => {
    const url = buildApiUrl("/inventoryStocks");
    return await post(url, data);
  },

  updateInventoryStock: async (queryString, data) => {
    const url = buildApiUrl("/inventoryStocks", queryString);
    return await put(url, data);
  },

  deleteInventoryStock: async (queryString) => {
    const url = buildApiUrl("/inventoryStocks", queryString);
    return await del(url);
  },

  searchInventoryStocks: async (query) => {
    const url = buildApiUrl("/search/inventoryStocks");
    return await post(url, query);
  },
};
