export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
