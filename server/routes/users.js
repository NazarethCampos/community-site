import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:uid', async (req, res) => {
  try {
    res.json({ 
      message: 'Get user profile endpoint',
      uid: req.params.uid 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (protected)
router.put('/:uid', verifyToken, async (req, res) => {
  try {
    // Verify user is updating their own profile
    if (req.user.uid !== req.params.uid) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ 
      message: 'Update user profile endpoint',
      uid: req.params.uid,
      updates: req.body 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user posts
router.get('/:uid/posts', async (req, res) => {
  try {
    res.json({ 
      message: 'Get user posts endpoint',
      uid: req.params.uid 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
