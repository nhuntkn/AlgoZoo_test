const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET_KEY, JWT_REFRESH_TOKEN_SECRET_KEY } = require('../config/env');

// Middleware for detecting authenticated logged-in user
exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    // get access token form authorization headers
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(403).json({ status: 'error', message: 'Authorization headers are required with Bearer token' });
    }
    // split token from authorization header
    const accesstoken = authorization.split(' ')[1];

    // verify token
    jwt.verify(accesstoken, JWT_SECRET_KEY, async (err, dec) => {
      if (err) {
        return res.status(401).json({ status: 'error', message: 'JWT access token is expired or invalid. Please logout and login again' })
      }

      // check if user exists
      const user = await User.findById(dec.id);

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found with the provided token' })
      }
      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ status: 'error', message: 'User is not active. Please login to continue' });
      }
      req.user = user;
      next(); 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// Middleware for validating refresh token
exports.isRefreshTokenValid = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(403).json({ status: 'error', message: 'Authorization headers are required with Bearer token' });
    }

    const token = authorization.split(' ')[1];

    // Verify refresh token
    jwt.verify(token, JWT_REFRESH_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', message: 'JWT refresh token is expired or invalid. Please logout and login again' });
      }

      // Check if user exists
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found with the provided token' });
      }

      req.user = user;  
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// Middleware to check if user is an admin
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Retrieve the user from the request object
    const { user } = req;

    // Check if user exists
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Sorry, User does not exist' });
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

// Middleware to check if user is a trainer OR an admin (both are allowed through)
exports.verifyTrainerOrAdmin = async (req, res, next) => {
  try {
    // Retrieve the user from the request object
    const { user } = req;

    // Check if user exists
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Sorry, User does not exist' });
    }

    // Check if user has trainer or admin privileges
    if (user.role === 'trainer' || user.role === 'admin') {
      return next(); // Proceed if the user is a trainer or an admin
    } else {
      return res.status(403).json({ status: 'error', message: 'Access denied. Only trainer or admin can access.' });
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
      return res.status(404).json({ status: 'error', message: 'Sorry, User does not exist' });
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
