import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { mockUsers } from '../data/mockData';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUsers[0]);

  const login = (email: string, password: string) => {
    if (!email || !password) {
      return;
    }

    const matchedUser = mockUsers.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      setUser(matchedUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
