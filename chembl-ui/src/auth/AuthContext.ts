import { createContext, useContext } from 'react';

export type User = {
  id: string;
  email: string;
  roles: string[];
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (data: { user: User; access_token: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
};