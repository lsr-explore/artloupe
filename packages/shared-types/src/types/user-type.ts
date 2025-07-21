export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user";
}

export function createUser(
  id: string,
  email: string,
  role: "admin" | "user",
  name?: string,
): User {
  return {
    id,
    email,
    role,
    ...(name && { name }),
  };
}

export function isAdmin(user: User): boolean {
  return user.role === "admin";
}

export function getUserDisplayName(user: User): string {
  return user.name || user.email;
}

export function isValidUser(object: unknown): object is User {
  return (
    typeof object === "object" &&
    object !== null &&
    "id" in object &&
    "email" in object &&
    "role" in object &&
    typeof (object as any).id === "string" &&
    typeof (object as any).email === "string" &&
    ["admin", "user"].includes((object as any).role)
  );
}
