import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ReactNode } from 'react';

interface RequireAuthProps{
    children:ReactNode
}

export default function RequireAuth({children}:RequireAuthProps) {
  const { token, loading } = useAuth();
  if (loading) return null;          
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
