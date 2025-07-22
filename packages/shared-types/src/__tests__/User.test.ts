import { describe, expect, it } from 'vitest';
import type * as UserTypes from '../types/user-type';
import {
  createUser,
  getUserDisplayName,
  isAdmin,
  isValidUser,
} from '../types/user-type';

describe('User', () => {
  it('should create a valid user with required fields', () => {
    const user: UserTypes.User = {
      id: '1',
      email: 'user@example.com',
      role: 'user',
    };

    expect(user.id).toBe('1');
    expect(user.email).toBe('user@example.com');
    expect(user.role).toBe('user');
  });

  it('should create a valid user with optional name field', () => {
    const user: UserTypes.User = {
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    };

    expect(user.id).toBe('2');
    expect(user.email).toBe('admin@example.com');
    expect(user.name).toBe('Admin User');
    expect(user.role).toBe('admin');
  });

  it('should allow undefined name field', () => {
    const user: UserTypes.User = {
      id: '3',
      email: 'test@example.com',
      name: undefined,
      role: 'user',
    };

    expect(user.id).toBe('3');
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBeUndefined();
    expect(user.role).toBe('user');
  });

  it('should validate user role types', () => {
    const adminUser: UserTypes.User = {
      id: '4',
      email: 'admin@example.com',
      role: 'admin',
    };

    const regularUser: UserTypes.User = {
      id: '5',
      email: 'user@example.com',
      role: 'user',
    };

    expect(adminUser.role).toBe('admin');
    expect(regularUser.role).toBe('user');
  });

  it('should create user with createUser function', () => {
    const user = createUser('12', 'test@example.com', 'user');
    expect(user.id).toBe('12');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('user');
    expect(user.name).toBeUndefined();
  });

  it('should create user with optional name', () => {
    const user = createUser('13', 'admin@example.com', 'admin', 'Admin User');
    expect(user.id).toBe('13');
    expect(user.email).toBe('admin@example.com');
    expect(user.role).toBe('admin');
    expect(user.name).toBe('Admin User');
  });

  it('should check if user is admin', () => {
    const adminUser = createUser('14', 'admin@example.com', 'admin');
    const regularUser = createUser('15', 'user@example.com', 'user');

    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(regularUser)).toBe(false);
  });

  it('should get user display name', () => {
    const userWithName = createUser(
      '16',
      'user@example.com',
      'user',
      'John Doe',
    );
    const userWithoutName = createUser('17', 'user2@example.com', 'user');

    expect(getUserDisplayName(userWithName)).toBe('John Doe');
    expect(getUserDisplayName(userWithoutName)).toBe('user2@example.com');
  });

  it('should validate user with isValidUser function', () => {
    const validUser = {
      id: '18',
      email: 'valid@example.com',
      role: 'user' as const,
    };

    const invalidUser = {
      id: 123,
      email: 'invalid@example.com',
      role: 'invalid_role',
    };

    expect(isValidUser(validUser)).toBe(true);
    expect(isValidUser(invalidUser)).toBe(false);
  });

  it('should handle different email formats', () => {
    const users: UserTypes.User[] = [
      {
        id: '7',
        email: 'simple@example.com',
        role: 'user',
      },
      {
        id: '8',
        email: 'test.user+tag@example.co.uk',
        role: 'admin',
      },
      {
        id: '9',
        email: 'user123@subdomain.example.org',
        role: 'user',
      },
    ];

    expect(users[0].email).toBe('simple@example.com');
    expect(users[1].email).toBe('test.user+tag@example.co.uk');
    expect(users[2].email).toBe('user123@subdomain.example.org');
  });

  it('should create users with both admin and user roles', () => {
    const adminUser: UserTypes.User = {
      id: '10',
      email: 'admin@company.com',
      name: 'System Admin',
      role: 'admin',
    };

    const regularUser: UserTypes.User = {
      id: '11',
      email: 'user@company.com',
      name: 'Regular User',
      role: 'user',
    };

    expect(adminUser.role).toBe('admin');
    expect(regularUser.role).toBe('user');
  });
});
