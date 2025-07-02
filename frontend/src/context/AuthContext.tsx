import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/client';
import type { AuthState, AuthResponse } from '../types/task';

interface AuthContextType extends AuthState {
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromStorage = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    // If invalid JSON, remove and return null
    localStorage.removeItem('user');
    return null;
  }
};
const getTokenFromStorage = () => localStorage.getItem('token');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState['user']>(getUserFromStorage());
  const [token, setToken] = useState<string | null>(getTokenFromStorage());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [user, token]);

  const login = async (data: { email: string; password: string }) => {
    setLoading(true); setError(undefined);
    try {
      const res = await apiLogin(data);
      const authData = res.data as AuthResponse;
      setUser(authData.user);
      setToken(authData.token);
      if (authData.token) {
        localStorage.setItem('token', authData.token); // Đảm bảo luôn lưu token
      } else {
        console.warn('[Auth] No token received from backend!');
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    setLoading(true); setError(undefined);
    try {
      const res = await apiRegister(data);
      const authData = res.data as AuthResponse;
      setUser(authData.user);
      setToken(authData.token);
      if (authData.token) {
        localStorage.setItem('token', authData.token); // Đảm bảo luôn lưu token
      } else {
        console.warn('[Auth] No token received from backend!');
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true); setError(undefined);
    try {
      await apiLogout();
    } catch {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
