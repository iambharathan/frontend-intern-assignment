import api from '@/lib/api';
import { AuthResponse, LoginFormData, RegisterFormData } from '@/types';

/**
 * Register new user
 */
export const registerUser = async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
  const response = await api.post<AuthResponse>('/auth/signup', data);
  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (data: LoginFormData) => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.data || response.data;
};
