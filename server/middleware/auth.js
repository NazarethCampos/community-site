import { auth } from '../config/firebase-admin.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    if (!auth) {
      return res.status(500).json({ error: 'Firebase Admin not initialized' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (token && auth) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
