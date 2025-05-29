import { Navigate, Outlet } from 'react-router-dom';
import { Role, useAuth } from './AuthProvider';
import { ReactNode } from 'react';

interface RequireAuthProps{
    children?:ReactNode,
    role?:Role
}

export default function RequireAuth({children, role}:RequireAuthProps) {
  const authContext = useAuth();
  if (authContext.loading) return null;          
  if (!authContext.token || (role && authContext.role != role)) return <Navigate to="/login" replace />;
  if(children) return <>{children}</>
  else return <Outlet/>
}
