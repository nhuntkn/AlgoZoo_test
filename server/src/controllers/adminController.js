const User = require('../models/user');
const validateEmail = require('../validators/emailFormat');


// TODO: Controller for admin to get all users information
exports.getUser = async (req,res) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No users found',
      });
    }
    res.status(200).json(
      {
        status: "success",
        message: "Users information retrieved successfully",
        count: users.length,
        data:
        {
          users
        }
      }
    )
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// Controller for getting user info by ID (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User does not exist',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User information retrieved successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role || 'student', // Default to 'student' if role is not set
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR',
    });
  }
};

// TODO: Controller for admin to get all users with role 'student' or 'trainer'
exports.getUserWithRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || (role !== 'student' && role !== 'trainer')) {
      return res.status(400).json({status: 'error', message: 'Invalid role. Please specify either "student" or "trainer".' });
    }

    const users = await User.find({ role }).select('-password');
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};