export const selectCategories = (state) => (state.category ? state.category.categories : []);
export const selectCategory = (state) => (state.category ? state.category.category : null);
