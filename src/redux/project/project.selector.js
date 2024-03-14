import { createSelector } from "@reduxjs/toolkit";

export const selectProject = (state) => (state.project ? state.project.project : null);
export const selectProjects = (state) => (state.project ? state.project.projects : []);

export const selectActiveProject = createSelector(selectProjects, (projects) => {
  if (projects && projects.length > 0) {
    return projects.find((it) => it.status !== "closed" && it.status !== "done");
  } else {
    return [];
  }
});

// export const selectActiveProjectByRoleName = createSelector(
//     [
//         selectProjects,
//         (state, roleName) => roleName,
//     ],
//     (projects, roleName) => {
//         if(roleName === 'sales'){
//             return projects.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//         }else if(roleName === 'technician'){
//             return projects.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//         }else{
//             return []
//         }
//     }
// );
export const selectActiveProjectByClientId = createSelector(
  [selectProjects, (state, clientId) => clientId],
  (projects, clientId) => {
    if (projects && projects.length > 0) {
      return projects.find(
        (it) => it.client._id === clientId && it.status !== "closed" && it.status !== "done"
      );
    } else {
      return [];
    }
  }
);

// non selector
// export const getActiveProjectByRoleName = (projects, roleName) => {
//     if(roleName === 'sales'){
//         return projects.find((it) => it.status !== "closed" && it.status !== "done" && it.sales);
//     }else if(roleName === 'technician'){
//         return projects.find((it) => it.status !== "closed" && it.status !== "done" && it.technician);
//     }else{
//         return []
//     }
// }
