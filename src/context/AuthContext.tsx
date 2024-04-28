import { createContext, useContext } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  authToken: string | null;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}  


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}