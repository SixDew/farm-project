// AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { login as apiLogin, adminLogin as apiAdminLogin } from './sensors/users-api';
import { refreshToken, removeRefreshToken } from './sensors/api/sensors-api';

export type Role = 'user' | 'admin' | null;
export interface AuthContextType {
  token: string | null;
  role: Role;
  loading: boolean;
  id:number|null;
  login: (pass: string, asAdmin?: boolean) => Promise<void>;
  logout: () => void;
  sendWithAccessCheck:(action: () => Promise<Response>)=>Promise<Response>;
}

interface AuthProviderProps{
  children:ReactNode
}
const AuthContext = createContext<AuthContextType>(null!);

export default function AuthProvider({ children }:AuthProviderProps){
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<number|null>(null);

  const updateLoginData = (data:any)=>{
    localStorage.setItem('userKey', data.key);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.userId);
    setToken(data.key);
    setRole(data.role);
    setId(data.userId);
  }

  useEffect(() => {
    const t = localStorage.getItem('userKey');
    const r = localStorage.getItem('role') as Role;
    const id = localStorage.getItem('userId') as number|null;
    if (t && r && id) {
      setToken(t);
      setRole(r);
      setId(id);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (pass: string, asAdmin = false) => {
    setLoading(true);
    const resp = asAdmin
      ? await apiAdminLogin(pass)
      : await apiLogin(pass);
    if (resp.ok) {
      const data = await resp.json()
      updateLoginData(data)
    } else {
      throw new Error('Неверный ключ')
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async ()=> {
    await removeRefreshToken()
    localStorage.removeItem('userKey');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setRole(null);
    setId(null);
  }, []);

    const refreshAccessToken = useCallback(async () => {
      console.log("refresh token")
    const response = await refreshToken();
    if(response.ok){
     var data = await response.json()
     console.log("token data:", data)
     updateLoginData(data) 
    }
  }, []);

  const sendWithAccessCheck = useCallback( async ( action: () => Promise<Response>) => {
      let response = await action()

      if (response.status === 403 || response.status === 401) {
        await refreshAccessToken()
        response = await action()
        if(response.status === 403|| response.status === 401){
          logout()
        }
      }

      return response
    }, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ token, role, loading, id, login, logout, sendWithAccessCheck }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
