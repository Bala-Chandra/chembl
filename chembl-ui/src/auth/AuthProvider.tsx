import { useState } from 'react';
import { AuthContext, type User } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ initialize from localStorage (no effect needed)
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data: { user: User; access_token: string }) => {
    setUser(data.user);
    setToken(data.access_token);

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}