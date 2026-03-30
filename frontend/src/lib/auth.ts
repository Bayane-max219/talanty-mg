import Cookies from 'js-cookie';
import type { User } from './api';

export const saveAuth = (token: string, user: User) => {
  Cookies.set('token', token, { expires: 1, sameSite: 'lax' });
  Cookies.set('user', JSON.stringify(user), { expires: 1, sameSite: 'lax' });
};

export const getUser = (): User | null => {
  const raw = Cookies.get('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return Cookies.get('token') || null;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const isAuthenticated = (): boolean => !!getToken();
