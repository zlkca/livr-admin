export const isAdmin = (account) => {
  return account && (account.role === "admin" || account.role === "root");
};
export const isSales = (account) => {
  return account && account.role === "sales";
};

export const isStoreManager = (account) => {
  return account && account.role === "store manager";
};

export const isDrawingEngineer = (account) => {
  return account && account.role === "engineer";
};

export const isTechnician = (account) => {
  return account && account.role === "technician";
};

export function getClientsQuery(user, branchId) {
  if (isAdmin(user)) {
    return { role: "client" };
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId, role: "client" };
  } else if (isSales(user)) {
    return { "sales._id": user._id, role: "client" };
  } else {
    return { "sales._id": user._id, role: "client" };
  }
}

// role --- 'sales' or 'technician'
// Notes: 'store manager' can act as 'sales' or 'technician'
export function getEmployeesQueryByRole(user, branchId, role) {
  if (isAdmin(user)) {
    return { role: { $in: [role, "store manager"] } };
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId, role: { $in: [role, "store manager"] } };
  } else {
    return { "branch._id": branchId, role: { $in: [role, "store manager"] } };
  }
}

// role --- 'sales' or 'technician'
// Notes: 'store manager' can act as 'sales' or 'technician'
export function getEmployeesQuery(user, branchId) {
  if (isAdmin(user)) {
    return { role: { $in: ["admin", "store manager", "sales", "technician", "user"] } };
  } else if (isStoreManager(user)) {
    return {
      "branch._id": branchId,
      role: { $in: ["store manager", "sales", "technician", "user"] },
    };
  } else {
    return {
      "branch._id": branchId,
      role: { $in: ["store manager", "sales", "technician", "user"] },
    };
  }
}

export function getAccountsQuery(user, branchId, role) {
  if (role === "client") {
    return getClientsQuery(user, branchId);
  } else {
    return getEmployeesQueryByRole(user, branchId, role);
  }
}

// project, order
export function getItemsQuery(user, branchId) {
  if (isAdmin(user)) {
    return {};
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId };
  } else if (isSales(user)) {
    return { "sales._id": user._id };
  } else {
    return { "sales._id": user._id };
  }
}
export function getAppointmentsQuery(user, branchId) {
  if (isAdmin(user)) {
    return {};
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId };
  } else if (isSales(user)) {
    return { "employee._id": user._id };
  } else {
    return { "employee._id": user._id };
  }
}
// export const getMyClientListQuery = (keyword, roles, signedInUser) => {
//     const clientRole = roles.find((r) => r.name === "client");
//     if (clientRole) {
//       if (isAdmin(signedInUser) || isDrawingEngineer(signedInUser)) {
//         return keyword ? { keyword, roleId: clientRole._id } : { roleId: clientRole._id };
//       } else if (isSales(signedInUser) || isPartner(signedInUser)) {
//         const q = {
//           roleId: clientRole._id,
//           recommenderId: signedInUser._id,
//         };
//         return keyword ? { keyword, ...q } : q;
//       } else {
//         return null;
//       }
//     } else {
//       return null;
//     }
// };
