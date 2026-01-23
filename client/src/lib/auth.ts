import { apiFetch } from './api';
import { tokenStorage } from './tokenStorage';
import { LoginResponse, RegisterData, LoginData } from '@/src/types/auth';

export async function register(data: RegisterData): Promise<void> {
  await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  tokenStorage.setAccessToken(response.accessToken);
  if (response.refreshToken) {
    tokenStorage.setRefreshToken(response.refreshToken);
  }
  if (response.user) {
    tokenStorage.setUser(response.user);
  }

  return response;
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    const body: { refreshToken?: string } = {};
    if (refreshToken) {
      body.refreshToken = refreshToken;
    }

    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    tokenStorage.clearTokens();
  }
}

export function isAuthenticated(): boolean {
  return !!tokenStorage.getAccessToken();
}
