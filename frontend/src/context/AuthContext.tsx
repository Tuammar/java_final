import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

interface User {
  name: string;
  surname: string;
  alias: string;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      setToken(storedToken);
      setIsAuthenticated(true);
      try {
        const decodedToken: any = jwtDecode(storedToken);
        setUser({ 
          name: decodedToken.name || 'Имя', 
          surname: decodedToken.surname || 'Фамилия', 
          alias: decodedToken.sub
        });
      } catch (error) {
        console.error("Failed to decode JWT: ", error);
        logout();
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setIsAuthenticated(true);
    try {
      const decodedToken: any = jwtDecode(newToken);
      setUser({ 
        name: decodedToken.name || 'Пользователь', 
        surname: decodedToken.surname || '', 
        alias: decodedToken.sub 
      });
    } catch (error) {
      console.error("Failed to decode JWT on login: ", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 