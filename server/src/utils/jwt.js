const jwt = require('jsonwebtoken');

const {JWT_SECRET_KEY,JWT_REFRESH_TOKEN_SECRET_KEY} = require('../config/env');

// Generate JWT Access Token
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
    }
  );
};
// Generate JWT Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
    }
  );
};
module.exports = {
  generateAccessToken,
  generateRefreshToken,
};