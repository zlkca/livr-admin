import { createSelector } from "@reduxjs/toolkit";

export const selectOrder = (state) => (state.order ? state.order.order : null);
export const selectOrders = (state) => (state.order ? state.order.orders : []);

export const selectActiveOrder = createSelector(selectOrders, (orders) => {
  if (orders && orders.length > 0) {
    return orders.find((it) => it.status !== "closed" && it.status !== "done");
  } else {
    return [];
  }
});

// export const selectActiveOrderByRoleName = createSelector(
//     [
//         selectOrders,
//         (state, roleName) => roleName,
//     ],
//     (orders, roleName) => {
//         if(roleName === 'sales'){
//             return orders.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//         }else if(roleName === 'technician'){
//             return orders.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//         }else{
//             return []
//         }
//     }
// );
export const selectActiveOrderByClientId = createSelector(
  [selectOrders, (state, clientId) => clientId],
  (orders, clientId) => {
    if (orders && orders.length > 0) {
      return orders.find(
        (it) => it.client._id === clientId && it.status !== "closed" && it.status !== "done"
      );
    } else {
      return [];
    }
  }
);

// non selector
// export const getActiveOrderByRoleName = (orders, roleName) => {
//     if(roleName === 'sales'){
//         return orders.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//     }else if(roleName === 'technician'){
//         return orders.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//     }else{
//         return []
//     }
// }
