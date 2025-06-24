'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      // JWT 디코딩 or API로 사용자 정보 조회
      setUser({ username: storedUsername });
    }
  }, []);

  const login = (accessToken: string, username: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('username', username);
    setToken(accessToken);
    setUser({ username: username });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
