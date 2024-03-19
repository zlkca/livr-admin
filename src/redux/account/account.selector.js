export const selectAccounts = (state) => (state.account ? state.account.accounts : []);
export const selectAccount = (state) => (state.account ? state.account.account : null);

export const selectAccountHttpStatus = (state) => (state.account ? state.account.status : null);
export const selectClients = (state) => (state.account ? state.account.clients : []);
export const selectEmployees = (state) => (state.account ? state.account.employees : []);
export const selectClient = (state) => (state.account ? state.account.client : null);
export const selectPartner = (state) => (state.account ? state.account.partner : null);
export const selectEmployee = (state) => (state.account ? state.account.employee : null);
