import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { JSX } from 'react/jsx-dev-runtime';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}


export function AdminRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();

  if (!user?.roles.includes('admin')) {
    return <Navigate to="/" />;
  }

  return children;
}