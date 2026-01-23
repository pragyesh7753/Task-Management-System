import { tokenStorage } from './tokenStorage';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const accessToken = tokenStorage.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && !path.startsWith('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiFetch<T>(path, options));
      }

      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        const refreshBody: { refreshToken?: string } = {};
        if (refreshToken) {
          refreshBody.refreshToken = refreshToken;
        }

        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(refreshBody),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          
          if (data.accessToken) {
            tokenStorage.setAccessToken(data.accessToken);
          }
          if (data.refreshToken) {
            tokenStorage.setRefreshToken(data.refreshToken);
          }

          processQueue(null);
          isRefreshing = false;

          return apiFetch<T>(path, options);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        processQueue(error as Error);
        isRefreshing = false;
        tokenStorage.clearTokens();
        
        if (typeof window !== 'undefined') {
          toast.error('Session expired, please login again');
          window.location.href = '/login';
        }
        
        throw error;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
