export const selectPayments = (state) => (state.payment ? state.payment.payments : []);
export const selectPayment = (state) => (state.payment ? state.payment.payment : null);
