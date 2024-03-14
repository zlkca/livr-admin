import { createSelector } from "@reduxjs/toolkit";

export const selectBranch = (state) => (state.branch ? state.branch.branch : null);
export const selectBranches = (state) => (state.branch ? state.branch.branches : []);

export const selectActiveBranch = createSelector(selectBranches, (branches) => {
  if (branches && branches.length > 0) {
    return branches.find((it) => it.status !== "closed" && it.status !== "done");
  } else {
    return [];
  }
});

// export const selectActiveBranchByRoleName = createSelector(
//     [
//         selectBranches,
//         (state, roleName) => roleName,
//     ],
//     (branches, roleName) => {
//         if(roleName === 'sales'){
//             return branches.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//         }else if(roleName === 'technician'){
//             return branches.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//         }else{
//             return []
//         }
//     }
// );
export const selectActiveBranchByClientId = createSelector(
  [selectBranches, (state, clientId) => clientId],
  (branches, clientId) => {
    if (branches && branches.length > 0) {
      return branches.find(
        (it) => it.client._id === clientId && it.status !== "closed" && it.status !== "done"
      );
    } else {
      return [];
    }
  }
);

// non selector
// export const getActiveBranchByRoleName = (branches, roleName) => {
//     if(roleName === 'sales'){
//         return branches.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//     }else if(roleName === 'technician'){
//         return branches.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//     }else{
//         return []
//     }
// }
