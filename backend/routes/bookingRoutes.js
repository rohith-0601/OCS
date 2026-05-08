import express from 'express';

import {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getRoomSchedule,
} from '../controllers/bookingController.js';

import { protect } from '../middleware/auth.js';

import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all bookings
router.get('/', getBookings);

// Create booking
router.post(
  '/',
  authorize('admin', 'core'),
  createBooking
);

// Get room schedule
router.get(
  '/room/:roomId/schedule',
  getRoomSchedule
);

// Get single booking
router.get('/:id', getBooking);

// Cancel booking
router.put(
  '/:id/cancel',
  cancelBooking
);

export default router;