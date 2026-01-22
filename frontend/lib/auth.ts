import { User } from '@/types';

/**
 * Set a cookie
 */
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

/**
 * Get a cookie
 */
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Delete a cookie
 */
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Save auth data to cookies and localStorage (fallback)
 */
export const setAuthData = (token: string, user: User) => {
  // Store in cookies for middleware
  setCookie('token', token, 7);
  setCookie('user', JSON.stringify(user), 7);
  
  // Also store in localStorage for client-side access
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get auth token
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getCookie('token') || localStorage.getItem('token');
};

/**
 * Get current user
 */
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = getCookie('user') || localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Clear auth data (logout)
 */
export const clearAuth = () => {
  deleteCookie('token');
  deleteCookie('user');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
