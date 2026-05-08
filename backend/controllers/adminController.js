import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// Create user
const createUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
    } = req.body;

    // Check existing user
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,

      role: role || 'core',

      department,

      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,

      message:
        'User created successfully',

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department:
          user.department,

        isActive: user.isActive,

        createdAt:
          user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers = async (
  req,
  res,
  next
) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate(
        'createdBy',
        'name email'
      )
      .sort('-createdAt');

    res.json({
      success: true,

      count: users.length,

      users,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      role,
      department,
      isActive,
    } = req.body;

    // Prevent self deactivation
    if (
      req.params.id ===
        req.user._id.toString() &&
      isActive === false
    ) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot deactivate your own account',
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          role,
          department,
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,

      message:
        'User updated successfully',

      user,
    });
  } catch (error) {
    next(error);
  }
};

// Reset user password
const resetUserPassword = async (
  req,
  res,
  next
) => {
  try {
    const { newPassword } = req.body;

    // Password validation
    if (
      !newPassword ||
      newPassword.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Password must be at least 6 characters',
      });
    }

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update password
    user.password = newPassword;

    // pre('save') hashes password
    await user.save();

    res.json({
      success: true,

      message:
        'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (
  req,
  res,
  next
) => {
  try {
    // Prevent self deletion
    if (
      req.params.id ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot delete your own account',
      });
    }

    const user =
      await User.findByIdAndDelete(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,

      message:
        'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard stats
const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    // Today's date range
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    // Parallel DB queries
    const [
      totalUsers,
      totalRooms,
      totalBookings,
      todayBookings,
      upcomingBookings,
    ] = await Promise.all([
      User.countDocuments({
        isActive: true,
      }),

      Room.countDocuments({
        isAvailable: true,
      }),

      Booking.countDocuments({
        status: 'confirmed',
      }),

      Booking.countDocuments({
        status: 'confirmed',

        date: {
          $gte: today,
          $lt: tomorrow,
        },
      }),

      Booking.countDocuments({
        status: 'confirmed',

        date: {
          $gte: today,
        },
      }),
    ]);

    // Aggregate bookings by purpose
    const byPurpose =
      await Booking.aggregate([
        {
          $match: {
            status: 'confirmed',
          },
        },

        {
          $group: {
            _id: '$purpose',

            count: {
              $sum: 1,
            },
          },
        },
      ]);

    res.json({
      success: true,

      stats: {
        totalUsers,

        totalRooms,

        totalBookings,

        todayBookings,

        upcomingBookings,

        byPurpose,
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  createUser,
  getAllUsers,
  updateUser,
  resetUserPassword,
  deleteUser,
  getDashboardStats,
};