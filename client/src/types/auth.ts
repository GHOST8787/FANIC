export interface User {
  id: number;
  name: string;
  email: string;
  provider: 'google' | 'facebook' | 'line';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
} 