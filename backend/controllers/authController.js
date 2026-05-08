import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({
      email,
    }).select('+password');

    // Check credentials
    if (
      !user ||
      !(await user.matchPassword(
        password
      ))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check active status
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message:
          'Account deactivated. Contact admin.',
      });
    }

    // Generate JWT token
    const token = generateToken(
      user._id
    );

    // Send response
    res.json({
      success: true,

      token,

      user: {
        _id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        department:
          user.department,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
const getMe = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change own password
// @route   PUT /api/auth/change-password
const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // Fetch user with password
    const user = await User.findById(
      req.user._id
    ).select('+password');

    // Check current password
    if (
      !(await user.matchPassword(
        currentPassword
      ))
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;

    // pre('save') middleware hashes password
    await user.save();

    res.json({
      success: true,
      message:
        'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  login,
  getMe,
  changePassword,
};