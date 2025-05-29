// AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { login as apiLogin, adminLogin as apiAdminLogin } from './sensors/users-api';

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
      const data = await resp.json();
      localStorage.setItem('userKey', data.key);
      localStorage.setItem('role', asAdmin ? 'admin' : 'user');
      localStorage.setItem('userId', data.userId);
      setToken(data.key);
      setRole(asAdmin ? 'admin' : 'user');
      setId(data.userId);
    } else {
      throw new Error('Неверный ключ');
    }
    setLoading(false);
  }, []);

  const logout = useCallback(()=> {
    localStorage.removeItem('userKey');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setRole(null);
    setId(null);
  }, []);

    const refreshAccessToken = useCallback(async () => {
      console.log("REFRESH TOKEN")
    // const refreshToken = getRefreshToken();
    // const { data } = await api.post('/auth/refresh', { refreshToken });
    // saveTokens(data.accessToken, data.refreshToken);
    // return data.accessToken;
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
