import express from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Store for demo purposes (in production, use a database)
const userSessions = new Map<string, any>();

// POST /api/users/login - DeSo user login
router.post('/login', asyncHandler(async (req, res) => {
  const { publicKey, username, profilePic } = req.body;

  if (!publicKey) {
    return res.status(400).json({
      success: false,
      message: 'Public key is required'
    });
  }

  // Store user session (in production, use proper session management)
  const userSession = {
    publicKey,
    username: username || 'Anonymous',
    profilePic: profilePic || '',
    loginTime: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  userSessions.set(publicKey, userSession);

  console.log(`✅ DeSo user logged in: ${username} (${publicKey.substring(0, 20)}...)`);

  res.json({
    success: true,
    message: 'Successfully logged in with DeSo',
    user: {
      publicKey,
      username: userSession.username,
      profilePic: userSession.profilePic,
    }
  });
}));

// GET /api/users/profile - Get user profile
router.get('/profile/:publicKey?', asyncHandler(async (req, res) => {
  const { publicKey } = req.params;
  
  if (!publicKey) {
    return res.status(400).json({
      success: false,
      message: 'Public key is required'
    });
  }

  const userSession = userSessions.get(publicKey);
  
  if (!userSession) {
    return res.status(404).json({
      success: false,
      message: 'User session not found'
    });
  }

  res.json({
    success: true,
    user: {
      publicKey: userSession.publicKey,
      username: userSession.username,
      profilePic: userSession.profilePic,
      loginTime: userSession.loginTime,
      lastActivity: userSession.lastActivity,
    }
  });
}));

// POST /api/users/logout - User logout
router.post('/logout', asyncHandler(async (req, res) => {
  const { publicKey } = req.body;
  
  if (publicKey && userSessions.has(publicKey)) {
    userSessions.delete(publicKey);
    console.log(`🚪 User logged out: ${publicKey.substring(0, 20)}...`);
  }

  res.json({
    success: true,
    message: 'Successfully logged out'
  });
}));

// GET /api/users/active - Get active users count
router.get('/active', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    activeUsers: userSessions.size,
    message: `${userSessions.size} active users`
  });
}));

export { router as userRoutes };
