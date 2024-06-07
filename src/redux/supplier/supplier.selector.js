export const selectSuppliers = (state) => (state.supplier ? state.supplier.suppliers : []);
export const selectSupplier = (state) => (state.supplier ? state.supplier.supplier : null);
