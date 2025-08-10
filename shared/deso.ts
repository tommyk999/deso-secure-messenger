// DeSo blockchain integration utilities

import { DesoUser } from './types';

export interface DesoConfig {
  nodeURL: string;
  appName: string;
  logoURL?: string;
}

export class DesoAPI {
  private config: DesoConfig;

  constructor(config: DesoConfig) {
    this.config = config;
  }

  /**
   * Initialize DeSo identity and get user information
   */
  async initializeIdentity(): Promise<DesoUser | null> {
    try {
      // Check if DeSo Identity is available
      if (typeof window === 'undefined' || !(window as any).deso) {
        throw new Error('DeSo Identity not available');
      }

      const deso = (window as any).deso;
      
      // Request permissions
      const response = await deso.identity.login();
      
      if (!response || !response.publicKeyBase58Check) {
        return null;
      }

      // Get user profile information
      const userProfile = await this.getUserProfile(response.publicKeyBase58Check);
      
      return {
        publicKey: response.publicKeyBase58Check,
        username: userProfile?.Username || 'Anonymous',
        profilePic: userProfile?.ProfilePic || '',
        verified: userProfile?.IsVerified || false,
      };
    } catch (error) {
      console.error('Failed to initialize DeSo identity:', error);
      return null;
    }
  }

  /**
   * Get user profile from DeSo
   */
  async getUserProfile(publicKey: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.nodeURL}/get-single-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PublicKeyBase58Check: publicKey,
        }),
      });

      const data = await response.json();
      return data.Profile;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  /**
   * Search for users by username
   */
  async searchUsers(query: string): Promise<DesoUser[]> {
    try {
      const response = await fetch(`${this.config.nodeURL}/get-profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: query,
          NumToFetch: 20,
        }),
      });

      const data = await response.json();
      
      return (data.ProfilesFound || []).map((profile: any) => ({
        publicKey: profile.PublicKeyBase58Check,
        username: profile.Username,
        profilePic: profile.ProfilePic || '',
        verified: profile.IsVerified || false,
      }));
    } catch (error) {
      console.error('Failed to search users:', error);
      return [];
    }
  }

  /**
   * Verify user identity using DeSo signature
   */
  async verifyUserIdentity(publicKey: string, signature: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.nodeURL}/verify-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PublicKeyBase58Check: publicKey,
          Signature: signature,
          Message: message,
        }),
      });

      const data = await response.json();
      return data.IsValid || false;
    } catch (error) {
      console.error('Failed to verify user identity:', error);
      return false;
    }
  }

  /**
   * Sign a message using DeSo identity
   */
  async signMessage(message: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined' || !(window as any).deso) {
        throw new Error('DeSo Identity not available');
      }

      const deso = (window as any).deso;
      const response = await deso.identity.sign({
        message: message,
      });

      return response.signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      return null;
    }
  }

  /**
   * Create a DeSo post (for public announcements)
   */
  async createPost(content: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined' || !(window as any).deso) {
        throw new Error('DeSo Identity not available');
      }

      const deso = (window as any).deso;
      const response = await deso.identity.submitPost({
        body: content,
      });

      return response.submittedTransactionResponse?.TxnHashHex || null;
    } catch (error) {
      console.error('Failed to create post:', error);
      return null;
    }
  }

  /**
   * Get current user's DeSo balance
   */
  async getBalance(publicKey: string): Promise<number> {
    try {
      const response = await fetch(`${this.config.nodeURL}/get-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PublicKeyBase58Check: publicKey,
        }),
      });

      const data = await response.json();
      return data.BalanceNanos || 0;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  /**
   * Initialize DeSo Identity iframe (for web integration)
   */
  static initializeDesoIdentity(config: DesoConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Not running in browser environment'));
        return;
      }

      // Create and append DeSo Identity script
      const script = document.createElement('script');
      script.src = 'https://identity.deso.org/embed';
      script.async = true;
      
      script.onload = () => {
        // Configure DeSo Identity
        (window as any).deso?.configure({
          nodeURI: config.nodeURL,
          appName: config.appName,
          logoURL: config.logoURL,
        });
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load DeSo Identity'));
      };

      document.head.appendChild(script);
    });
  }
}

export default DesoAPI;
