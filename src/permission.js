// The roles that can sale
export const SalesRoles = ["admin", "store manager", "sales"];
// The roles that can do field sale and make appointment
export const FieldSalesRoles = ["admin", "store manager", "field sales"];
// The roles that can do field sale and make appointment
export const TechnicianRoles = ["admin", "store manager", "technician"];

export const isEmployee = (account) => {
  return account?.roles?.some((it) =>
    ["sales", "field sales", "technician", "admin", "store manager"].includes(it)
  );
};

export const isPartner = (account) => {
  return account && account.roles.includes("partner");
};

export const isAdmin = (account) => {
  return account?.roles?.includes("admin") || account?.roles?.includes("root");
};
export const isClient = (account) => {
  return account?.roles?.includes("client");
};
export const isSales = (account) => {
  return account?.roles?.includes("sales");
};

export const isStoreManager = (account) => {
  return account?.roles?.includes("store manager");
};

export const isManager = (account) => {
  return (
    account?.roles?.includes("admin") ||
    account?.roles?.includes("root") ||
    account?.roles?.includes("store manager")
  );
};

export const isDrawingEngineer = (account) => {
  return account?.roles?.includes("engineer");
};

export const isTechnician = (account) => {
  return account?.roles?.includes("technician");
};

export function getClientsQuery(user, branchId) {
  if (isAdmin(user)) {
    return { roles: ["client"] };
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId, roles: ["client"] };
  } else if (isSales(user)) {
    return { "sales._id": user._id, roles: ["client"] };
  } else {
    return { "sales._id": user._id, roles: ["client"] };
  }
}

// Backdrop list
export function getEmployeesQueryByRoles(user, branchId, roles) {
  if (isAdmin(user)) {
    return { $or: [{ roles: { $in: roles } }] };
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId, roles: { $in: roles } };
  } else {
    return { "branch._id": branchId, roles: { $in: roles } };
  }
}

// Use for getting employee list
// Notes: 'store manager' can act as 'sales' or 'technician'
export function getEmployeesQuery(user, branchId) {
  if (isAdmin(user)) {
    return {
      roles: { $in: ["admin", "store manager", "sales", "field sales", "technician", "user"] },
    };
  } else if (isStoreManager(user)) {
    return {
      "branch._id": branchId,
      roles: { $in: ["store manager", "sales", "field sales", "technician", "user"] },
    };
  } else {
    return {
      "branch._id": branchId,
      roles: { $in: ["store manager", "sales", "field sales", "technician", "user"] },
    };
  }
}

export function getActiveEmployeesQuery(user, branchId) {
  if (isAdmin(user)) {
    return { roles: { $in: ["admin", "store manager", "sales", "field sales", "technician"] } };
  } else if (isStoreManager(user)) {
    return {
      "branch._id": branchId,
      roles: { $in: ["store manager", "sales", "field sales", "technician"] },
    };
  } else {
    return {
      "branch._id": branchId,
      roles: { $in: ["store manager", "sales", "field sales", "technician"] },
    };
  }
}

// project, order
export function getItemsQuery(user, branchId) {
  if (isAdmin(user)) {
    return {};
  } else if (isStoreManager(user)) {
    return { "branch._id": branchId };
  } else {
    const conditions = [];
    user.roles.forEach((it) => {
      if (it === "sales") {
        conditions.push({ "sales._id": user._id });
      } else if (it === "field sales") {
        conditions.push({ "fieldSales._id": user._id });
      } else if (it === "technician") {
        conditions.push({ "technician._id": user._id });
      }
    });
    return { $or: conditions, "branch._id": branchId };
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
