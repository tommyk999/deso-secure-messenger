import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    publicKey: string;
    username: string;
    verified: boolean;
  };
}

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      publicKey: string;
      username: string;
      verified: boolean;
    };
  };
}

/**
 * Middleware to authenticate JWT tokens in HTTP requests
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user from database
    const user = await User.findOne({ publicKey: decoded.publicKey });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Attach user info to request
    req.user = {
      publicKey: user.publicKey,
      username: user.username,
      verified: user.verified,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to authenticate WebSocket connections
 */
export async function authenticateSocket(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user from database
    const user = await User.findOne({ publicKey: decoded.publicKey });
    if (!user) {
      return next(new Error('User not found'));
    }

    // Update online status
    user.updateOnlineStatus(true);
    await user.save();

    // Attach user info to socket
    socket.data = {
      user: {
        publicKey: user.publicKey,
        username: user.username,
        verified: user.verified,
      },
    };

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Invalid or expired token'));
  }
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user: { publicKey: string; username: string }): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    {
      publicKey: user.publicKey,
      username: user.username,
    },
    jwtSecret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      issuer: 'deso-secure-messenger',
      subject: user.publicKey,
    }
  );
}

/**
 * Verify DeSo signature for identity authentication
 */
export async function verifyDesoSignature(
  publicKey: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    const desoNodeUrl = process.env.DESO_NODE_URL || 'https://node.deso.org';
    
    const response = await fetch(`${desoNodeUrl}/api/v0/verify-signature`, {
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
    return data.IsValid === true;
  } catch (error) {
    console.error('Failed to verify DeSo signature:', error);
    return false;
  }
}

/**
 * Middleware to require verified DeSo identity
 */
export async function requireVerifiedIdentity(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const user = await User.findOne({ publicKey: req.user.publicKey });
  if (!user || (!user.verified && user.securitySettings.requireIdentityVerification)) {
    res.status(403).json({ 
      error: 'Verified DeSo identity required for this action',
      code: 'IDENTITY_VERIFICATION_REQUIRED'
    });
    return;
  }

  next();
}
