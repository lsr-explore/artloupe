export type UserRoles = 'admin' | 'pro' | 'free';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRoles;
}

export function createUser(
  id: string,
  email: string,
  role: UserRoles,
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
  return user.role === 'admin';
}

export function getUserDisplayName(user: User): string {
  return user.name || user.email;
}

export function isValidUser(object: unknown): object is User {
  return (
    typeof object === 'object' &&
    object !== null &&
    'id' in object &&
    'email' in object &&
    'role' in object &&
    typeof (object as User).id === 'string' &&
    typeof (object as User).email === 'string' &&
    ['admin', 'pro', 'free'].includes((object as User).role)
  );
}
