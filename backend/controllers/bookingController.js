import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

const createBooking = async (req, res, next) => {
  try {
    const {
      room: roomId,
      date,
      startTime,
      endTime,
      purpose,
      participantCount,
      companyName,
      notes,
    } = req.body;

    // Validate time
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time',
      });
    }

    // Check room exists
    const room = await Room.findById(roomId).populate(
      'block',
      'name'
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check room availability
    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message:
          'Room is not available for booking',
      });
    }

    // Check capacity
    if (participantCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `Room capacity (${room.capacity}) is less than participant count (${participantCount})`,
      });
    }

    // Check allowed purpose
    if (
      !room.allowedPurposes.includes(purpose)
    ) {
      return res.status(400).json({
        success: false,
        message: `This room does not allow bookings for purpose: ${purpose}`,
      });
    }

    // Check booking conflict
    const conflict =
      await Booking.hasConflict(
        roomId,
        date,
        startTime,
        endTime
      );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Room is already booked from ${conflict.startTime} to ${conflict.endTime} on this date`,
      });
    }

    // Create booking
    const booking = await Booking.create({
      room: roomId,
      bookedBy: req.user._id,
      date,
      startTime,
      endTime,
      purpose,
      participantCount,
      companyName,
      notes,
    });

    // Populate booking
    const populated = await booking.populate([
      {
        path: 'room',
        populate: {
          path: 'block',
          select: 'name',
        },
      },
      {
        path: 'bookedBy',
        select: 'name email department',
      },
    ]);

    res.status(201).json({
      success: true,
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const {
      date,
      purpose,
      status,
      room,
    } = req.query;

    const filter = {};

    // Non-admin users only see their bookings
    if (req.user.role !== 'admin') {
      filter.bookedBy = req.user._id;
    }

    // Date filter
    if (date) {
      const d = new Date(date);

      d.setHours(0, 0, 0, 0);

      const nextDay = new Date(d);

      nextDay.setDate(nextDay.getDate() + 1);

      filter.date = {
        $gte: d,
        $lt: nextDay,
      };
    }

    // Other filters
    if (purpose) {
      filter.purpose = purpose;
    }

    if (status) {
      filter.status = status;
    }

    if (room) {
      filter.room = room;
    }

    // Fetch bookings
    const bookings = await Booking.find(filter)
      .populate({
        path: 'room',
        populate: {
          path: 'block',
          select: 'name',
        },
      })
      .populate(
        'bookedBy',
        'name email department'
      )
      .populate('cancelledBy', 'name')
      .sort({
        date: -1,
        startTime: -1,
      });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking =
      await Booking.findById(req.params.id)
        .populate({
          path: 'room',
          populate: {
            path: 'block',
            select: 'name',
          },
        })
        .populate(
          'bookedBy',
          'name email department'
        )
        .populate('cancelledBy', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      booking.bookedBy._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (
  req,
  res,
  next
) => {
  try {
    const booking =
      await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message:
          'Booking is already cancelled',
      });
    }

    // Authorization
    if (
      req.user.role !== 'admin' &&
      booking.bookedBy.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Not authorized to cancel this booking',
      });
    }

    // Cancel booking
    booking.status = 'cancelled';

    booking.cancelledBy = req.user._id;

    booking.cancelReason =
      req.body.cancelReason || '';

    await booking.save();

    res.json({
      success: true,
      message:
        'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

const getRoomSchedule = async (
  req,
  res,
  next
) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required',
      });
    }

    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    const nextDay = new Date(d);

    nextDay.setDate(
      nextDay.getDate() + 1
    );

    const bookings = await Booking.find({
      room: req.params.roomId,
      status: 'confirmed',
      date: {
        $gte: d,
        $lt: nextDay,
      },
    })
      .populate(
        'bookedBy',
        'name department'
      )
      .sort('startTime');

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getRoomSchedule,
};