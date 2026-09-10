const { JWT_TOKEN_COOKIE_EXPIRES } = require('../config/env');
const { loginResponse } = require('../ultils/response');
const validateEmail =require('../validators/emailFormat');
const {generateAccessToken} = require('../ultils/jwt');
const User = require('../models/user');

// TODO: Controller for login 
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
        return res.status(400).json({ message: 'User password is incorrect' });
        }

        const logUser = await User.findByIdAndUpdate(user._id, { status: 'login', updatedAt: Date.now() }, { new: true });
        loginResponse(res, logUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'SERVER SIDE ERROR' });
    }
};

// TODO: Controller for logout
exports.logoutUser = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({ message: 'Unauthorized access. Please login to continue' });
    }

    res.clearCookie('accessToken');
    await User.findByIdAndUpdate(user._id, { status: 'logout', updatedAt: Date.now() }, { new: true });
    
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'SERVER SIDE ERROR' });
  }
};

// TODO: Controller for user refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token is required'
      });
    }
    const accessToken = generateAccessToken(user._id);

    const options = {
      expires: new Date(Date.now() + JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie('accessToken', accessToken, options);
    return res.status(200).json({ message: 'JWT refresh token generated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'SERVER SIDE ERROR' });
  }
};
