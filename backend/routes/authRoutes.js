import express from 'express';

import {
  login,
  getMe,
  changePassword,
} from '../controllers/authController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', login);

// Get current logged-in user
router.get('/me', protect, getMe);

// Change password
router.put(
  '/change-password',
  protect,
  changePassword
);

export default router;