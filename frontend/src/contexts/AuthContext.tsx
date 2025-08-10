import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Deso, IdentityUsersResponse } from 'deso-protocol';
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

const DESO_NODE_URL = 'https://node.deso.org';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DesoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DeSo instance
  const deso = new Deso();

  const isAuthenticated = !!user;

  // Check for existing authentication on app start
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user has already logged in with DeSo Identity
      const loggedInUser = deso.identity.snapshot?.users?.[deso.identity.snapshot.currentUser || ''];
      
      if (loggedInUser) {
        await loadUserProfile(loggedInUser.publicKeyBase58Check);
      } else {
        // Check localStorage for saved session
        const savedUser = localStorage.getItem('deso_auth_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (publicKey: string) => {
    try {
      // Get user profile from DeSo
      const response = await fetch(`${DESO_NODE_URL}/api/v0/get-single-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PublicKeyBase58Check: publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      const profile = data.Profile;

      const userData: DesoUser = {
        publicKey,
        username: profile?.Username || 'Anonymous',
        profilePic: profile?.ProfilePic || '',
        isVerified: profile?.IsVerified || false,
        balanceNanos: profile?.BalanceNanos || 0,
      };

      setUser(userData);
      localStorage.setItem('deso_auth_user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Error loading user profile:', error);
      throw error;
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      toast.loading('Connecting to DeSo...', { id: 'login' });

      // Request login through DeSo Identity
      const response = await deso.identity.login();
      
      if (response && response.publicKeyAdded) {
        // Load the user's profile data
        const userData = await loadUserProfile(response.publicKeyAdded);
        
        toast.success(`Welcome ${userData.username}!`, { id: 'login' });
        
        // Send user data to our backend for session management
        try {
          await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              publicKey: userData.publicKey,
              username: userData.username,
              profilePic: userData.profilePic,
            }),
          });
        } catch (backendError) {
          console.warn('Backend login failed, but DeSo auth succeeded:', backendError);
          // Continue with DeSo-only auth if backend is unavailable
        }
        
      } else {
        throw new Error('Login was cancelled or failed');
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
      
      // Logout from DeSo Identity
      await deso.identity.logout(user?.publicKey || '');
      
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
      await loadUserProfile(user.publicKey);
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
