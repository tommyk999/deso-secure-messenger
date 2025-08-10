import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';

export interface DesoUser {
  publicKey: string;
  username?: string;
  profilePic?: string;
  isVerified?: boolean;
  balanceNanos?: number;
}

interface AuthContextType {
  user: DesoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DesoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing authentication on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check localStorage for saved session
      const savedUser = localStorage.getItem('deso_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      toast.loading('Simulating DeSo login...', { id: 'login' });

      // Simulate DeSo authentication (for demo)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoUser: DesoUser = {
        publicKey: 'BC1YL...demo_public_key_' + Math.random().toString(36).substr(2, 9),
        username: 'DemoUser' + Math.floor(Math.random() * 1000),
        profilePic: '',
        isVerified: Math.random() > 0.5,
        balanceNanos: Math.floor(Math.random() * 10000000000),
      };

      setUser(demoUser);
      localStorage.setItem('deso_auth_user', JSON.stringify(demoUser));
      
      toast.success(`Welcome ${demoUser.username}!`, { id: 'login' });
      
      // Send user data to our backend for session management
      try {
        await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKey: demoUser.publicKey,
            username: demoUser.username,
            profilePic: demoUser.profilePic,
          }),
        });
      } catch (backendError) {
        console.warn('Backend login failed, but auth succeeded:', backendError);
      }
        
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.', { id: 'login' });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      toast.loading('Signing out...', { id: 'logout' });
      
      // Clear local storage
      localStorage.removeItem('deso_auth_user');
      
      // Clear user state
      setUser(null);
      
      toast.success('Signed out successfully', { id: 'logout' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out', { id: 'logout' });
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      // Simulate refresh
      toast.success('Profile refreshed');
    } catch (error) {
      console.error('Error refreshing user:', error);
      toast.error('Failed to refresh user data');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
