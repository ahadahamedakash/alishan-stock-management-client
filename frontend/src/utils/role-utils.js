export const canManageProduct = (role) => {
  return role === "super_admin" || role === "admin";
};

export const canManageEmployee = (role) => {
  return role === "super_admin" || role === "admin";
};
