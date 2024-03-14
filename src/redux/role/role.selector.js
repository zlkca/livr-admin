export const selectRoles = (state) => (state.role ? state.role.roles : []);
export const selectRole = (state) => (state.role ? state.role.role : null);
