const User = require('../models/user');
const { APP_BASE_URL } = require('../config/env');
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
        email: user.email,
        avatarUrl: user.avatar ? APP_BASE_URL + user.avatar : null,
        status: user.status,
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

// TODO: Controller for create student user
exports.createUser = async (req, res) => { 
    try { 
        const { email, password, role } = req.body; 
        // 1. Validate required fields 
        if (!email || !password) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email and password are required' }); 
            }
        // 2. Validate email format 
        if (!validateEmail(email)) { 
            return res.status(400).json({ 
                status: 'error',
                message: 'Please provide a valid email address' }); 
            }
        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Password must be at least 6 characters' }); 
            }
        // 4. Validate role 
        if (role && !['student', 'trainer'].includes(role)) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Invalid role. Allowed roles are student, trainer' }); 
            }
        // 5. Check if email already exists
        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email already exists' }); 
            }
        // 6. Create the user
        const user = await User.create({
            email: email.trim().toLowerCase(),
            password: password,
            role: role || 'student'
        });
        // 7. Return success response
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                id: user._id,
                email: user.email,
                avatarUrl: user.avatar ? APP_BASE_URL + user.avatar : null,
                status: user.status,
                role: user.role || 'student',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
            error: error.message
        });
    }
};

