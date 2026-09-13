const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET_KEY, JWT_REFRESH_TOKEN_SECRET_KEY } = require('../config/env');

// Middleware for detecting authenticated logged-in user
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    // get access token from cookie
    const accesstoken = req.cookies.accessToken;

    if (!accesstoken) {
      return res.status(403).json({ status: 'error', message: 'Access token is required' });
    }
    // verify token
    jwt.verify(accesstoken, JWT_SECRET_KEY, async (err, dec) => {
      if (err) {
        return res.status(401).json({ status: 'error', message: 'JWT access token is expired or invalid. Please logout and login again' });
      }

      try {      
        // check if user exists
        const user = await User.findById(dec.id);

        if (!user) {
          return res.status(404).json({ status: 'error', message: 'User not found with the provided token' });
        }
        // Check if user is active
        if (!user.isActive) {
          return res.status(403).json({ status: 'error', message: 'User is not active. Please login to continue' });
        }
        req.user = user;
        return next(); 
      } catch (dbError) {
        console.error(dbError);
        res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'SERVER SIDE ERROR'
    });
  }
}

// Middleware for validating refresh token
exports.isRefreshTokenValid = async (req, res, next) => {
  try {
    // get refresh token from cookie
    const token = req.cookies.refreshToken;

    // Verify refresh token
    jwt.verify(token, JWT_REFRESH_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', message: 'JWT refresh token is expired or invalid. Please logout and login again' });
      }

      try {
        // Check if user exists
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(404).json({ status: 'error', message: 'User not found with the provided token' });
        }

        if (!user.isActive) {
          return res.status(403).json({ 
            status: 'error', 
            message: 'User is not active. Please login to continue' });
        }

        req.user = user;  
        return next(); // Proceed to the next middleware or route handler
      } catch (dbError) {
        console.error(dbError);
        return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      status: 'error',
      message: 'SERVER SIDE ERROR'
    });
  }
};

// Middleware to check if user is an admin
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Retrieve the user from the request object
    const { user } = req;

    // Check if user exists
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Sorry, User does not exist' });
    }

    // Check if user has admin privileges
    if (user.role === 'admin') {
      return next(); // Proceed if the user is an admin
    } else {
      return res.status(403).json({ status: 'error', message: 'Access denied. Only admin can access.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// Middleware to check if user is an trainer
exports.verifyTrainer = async (req, res, next) => {
  try {
    // Retrieve the user from the request object
    const { user } = req;

    // Check if user exists
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Sorry, User does not exist' });
    }

    // Check if user has trainer privileges
    if (user.role === 'trainer') {
      return next(); // Proceed if the user is a trainer
    } else {
      return res.status(403).json({ status: 'error', message: 'Access denied. Only trainer can access.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
