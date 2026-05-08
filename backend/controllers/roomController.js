import Room from '../models/Room.js';
import Block from '../models/Block.js';
import Booking from '../models/Booking.js';

const getRooms = async (req, res, next) => {
  try {
    const {
      block,
      minCapacity,
      purpose,
      isAvailable,
    } = req.query;

    const filter = {};

    // Filter by block
    if (block) {
      filter.block = block;
    }

    // Filter by minimum capacity
    if (minCapacity) {
      filter.capacity = {
        $gte: parseInt(minCapacity),
      };
    }

    // Filter by purpose
    if (purpose) {
      filter.allowedPurposes = purpose;
    }

    // Filter by availability
    if (isAvailable !== undefined) {
      filter.isAvailable =
        isAvailable === 'true';
    }

    const rooms = await Room.find(filter)
      .populate('block', 'name')
      .sort('block name');

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

const getAvailableRooms = async (
  req,
  res,
  next
) => {
  try {
    const {
      date,
      startTime,
      endTime,
      purpose,
      participantCount,
      block,
    } = req.query;

    // Required fields
    if (
      !date ||
      !startTime ||
      !endTime ||
      !purpose ||
      !participantCount
    ) {
      return res.status(400).json({
        success: false,
        message:
          'date, startTime, endTime, purpose, and participantCount are required',
      });
    }

    // Time validation
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message:
          'End time must be after start time',
      });
    }

    // Find eligible rooms
    const roomFilter = {
      isAvailable: true,

      allowedPurposes: purpose,

      capacity: {
        $gte: parseInt(
          participantCount
        ),
      },
    };

    if (block) {
      roomFilter.block = block;
    }

    const eligibleRooms =
      await Room.find(roomFilter).populate(
        'block',
        'name'
      );

    // Date range
    const bookingDate = new Date(date);

    bookingDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(
      bookingDate
    );

    nextDay.setDate(
      nextDay.getDate() + 1
    );

    // Find conflicting bookings
    const conflictingBookings =
      await Booking.find({
        status: 'confirmed',

        date: {
          $gte: bookingDate,
          $lt: nextDay,
        },

        $or: [
          {
            startTime: {
              $lte: startTime,
            },

            endTime: {
              $gt: startTime,
            },
          },

          {
            startTime: {
              $lt: endTime,
            },

            endTime: {
              $gte: endTime,
            },
          },

          {
            startTime: {
              $gte: startTime,
            },

            endTime: {
              $lte: endTime,
            },
          },
        ],
      }).select('room');

    // Convert booked rooms to Set
    const bookedRoomIds = new Set(
      conflictingBookings.map((b) =>
        b.room.toString()
      )
    );

    // Remove booked rooms
    const availableRooms =
      eligibleRooms.filter(
        (room) =>
          !bookedRoomIds.has(
            room._id.toString()
          )
      );

    res.json({
      success: true,
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(
      req.params.id
    ).populate('block', 'name');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

const createRoom = async (
  req,
  res,
  next
) => {
  try {
    const room = await Room.create(
      req.body
    );

    const populated =
      await room.populate(
        'block',
        'name'
      );

    res.status(201).json({
      success: true,
      room: populated,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (
  req,
  res,
  next
) => {
  try {
    const room =
      await Room.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate('block', 'name');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (
  req,
  res,
  next
) => {
  try {
    const room =
      await Room.findByIdAndDelete(
        req.params.id
      );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.json({
      success: true,
      message:
        'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getBlocks = async (
  req,
  res,
  next
) => {
  try {
    const blocks = await Block.find({
      isActive: true,
    }).sort('name');

    res.json({
      success: true,
      blocks,
    });
  } catch (error) {
    next(error);
  }
};

const createBlock = async (
  req,
  res,
  next
) => {
  try {
    const block = await Block.create(
      req.body
    );

    res.status(201).json({
      success: true,
      block,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getRooms,
  getAvailableRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getBlocks,
  createBlock,
};