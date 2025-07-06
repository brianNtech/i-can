import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Mock authentication
    if ((username === 'user' && password === 'user') || (username === 'hrd' && password === 'hrd') || (username === 'hrd_premium' && password === 'hrd')) {
        let loggedInUser: User | undefined;
        if(username === 'user') loggedInUser = mockUsers.find(u => u.username === 'user');
        if(username === 'hrd') loggedInUser = mockUsers.find(u => u.username === 'hrd');
        if(username === 'hrd_premium') loggedInUser = mockUsers.find(u => u.username === 'hrd_premium');

      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
