const { JWT_TOKEN_COOKIE_EXPIRES } = require('../config/env');
const { loginResponse } = require('../ultils/response');
const {generateAccessToken} = require('../ultils/jwt');
const User = require('../models/user');
const validateEmail = require('../validators/emailFormat');
const bcrypt = require('bcryptjs');

//TODO: Controller for register user
exports.register = async (req, res) => {
  try { 
        const {username, password, role, name, email} = req.body; 
        // 1. Validate required fields 
        if (!username || !password) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Username and password are required' }); 
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
        // 5. Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Username already exists' }); 
            }
        // 6. Create the user
        const user = await User.create({
            name: name,
            username: username.trim(),
            password: password,
            email: email ? email.trim() : undefined,
            role: role || 'student'
        });
        // 7. Return success response
        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: {
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
      console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROr',
            error: error.message
        });
    }
};
// TODO: Controller for login 
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // validate username and password
        if (!username || !password) {
            return res.status(400).json({ status: 'error', message: 'Username and password are required' });
        }
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
        return res.status(404).json({ status: 'error', message: 'User does not exist' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
        return res.status(400).json({ status: 'error', message: 'User password is incorrect' });
        }

        const logUser = await User.findByIdAndUpdate(user._id, { isActive: true, updatedAt: Date.now() }, { new: true });
        loginResponse(res, logUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
    }
};

// TODO: Controller for logout
exports.logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Unauthorized access. Please login to continue' });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    await User.findByIdAndUpdate(user._id, { isActive: false, updatedAt: Date.now() }, { new: true });
    
    return res.status(200).json({status: 'success', message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// TODO: Controller for user refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User does not exist' });
    }
    const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }
    const accessToken = generateAccessToken(user._id);

    const options = {
      expires: new Date(Date.now() + JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('accessToken', accessToken, options);
    return res.status(200).json({ status: 'success', message: 'JWT refresh token generated successfully' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
