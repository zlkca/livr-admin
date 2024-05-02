export const selectProducts = (state) => (state.product ? state.product.products : []);
export const selectProduct = (state) => (state.product ? state.product.product : null);
