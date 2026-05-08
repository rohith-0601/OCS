import express from 'express';

import {
  getRooms,
  getAvailableRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getBlocks,
  createBlock,
} from '../controllers/roomController.js';

import { protect } from '../middleware/auth.js';

import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Block routes
router.get('/blocks', getBlocks);

router.post(
  '/blocks',
  authorize('admin'),
  createBlock
);

// Available rooms
router.get(
  '/available',
  getAvailableRooms
);

// Get all rooms
router.get('/', getRooms);

// Get single room
router.get('/:id', getRoom);

// Create room
router.post(
  '/',
  authorize('admin'),
  createRoom
);

// Update room
router.put(
  '/:id',
  authorize('admin'),
  updateRoom
);

// Delete room
router.delete(
  '/:id',
  authorize('admin'),
  deleteRoom
);

export default router;