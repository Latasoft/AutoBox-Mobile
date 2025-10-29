export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
  };
}

export interface User {
  id: number;
  email: string;
  role: string;
  permissions: any;
  name: string;
  balance: number;
  isActive: boolean;
  emailVerified: boolean;
}

export interface AuthError {
  status: number;
  message: string;
}