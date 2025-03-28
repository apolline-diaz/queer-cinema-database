export type UserRole = "user" | "admin";

// to manage roles
export function isValidUserRole(role: string): role is UserRole {
  return ["user", "admin"].includes(role);
}
