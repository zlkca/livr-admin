export const selectInventoryStocks = (state) =>
  state.inventory ? state.inventory.inventoryStocks : [];
export const selectInventoryStock = (state) =>
  state.inventory ? state.inventory.inventoryStock : null;

export const selectInventoryLocations = (state) =>
  state.inventory ? state.inventory.inventoryLocations : [];
export const selectInventoryLocation = (state) =>
  state.inventory ? state.inventory.inventoryLocation : null;

export const selectInventoryTransactions = (state) =>
  state.inventory ? state.inventory.inventoryTransactions : [];
export const selectInventoryTransaction = (state) =>
  state.inventory ? state.inventory.inventoryTransaction : null;
