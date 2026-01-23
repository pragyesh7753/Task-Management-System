let accessTokenMemory: string | null = null;
import type { User } from '@/src/types/auth';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (accessTokenMemory) return accessTokenMemory;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  setAccessToken: (token: string): void => {
    accessTokenMemory = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? (JSON.parse(user) as User) : null;
    }
    return null;
  },

  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  clearTokens: (): void => {
    accessTokenMemory = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};
