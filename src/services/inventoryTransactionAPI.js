import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const inventoryTransactionAPI = {
  fetchInventoryTransactions: async (queryString) => {
    const url = buildApiUrl("/inventoryTransactions", queryString);
    return await get(url);
  },

  fetchInventoryTransaction: async (queryString) => {
    const url = buildApiUrl("/inventoryTransactions", queryString);
    return await get(url);
  },

  createInventoryTransaction: async (data) => {
    const url = buildApiUrl("/inventoryTransactions");
    return await post(url, data);
  },

  updateInventoryTransaction: async (queryString, data) => {
    const url = buildApiUrl("/inventoryTransactions", queryString);
    return await put(url, data);
  },

  deleteInventoryTransaction: async (queryString) => {
    const url = buildApiUrl("/inventoryTransactions", queryString);
    return await del(url);
  },

  searchInventoryTransactions: async (query) => {
    const url = buildApiUrl("/search/inventoryTransactions");
    return await post(url, query);
  },
};
