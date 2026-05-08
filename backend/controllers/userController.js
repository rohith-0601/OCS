import User from '../models/User.js';

// @desc    Get own profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select('-password');

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const { name, department } =
      req.body;

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          department,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select('-password');

    res.json({
      success: true,

      message:
        'Profile updated successfully',

      user,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProfile,
  updateProfile,
};