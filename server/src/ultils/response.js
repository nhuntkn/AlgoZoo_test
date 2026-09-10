const {currentDateTime,getDateAfterDuration} = require('../ultils/date');
const {JWT_TOKEN_COOKIE_EXPIRES,JWT_ACCESS_TOKEN_EXPIRES,JWT_REFRESH_TOKEN_EXPIRES} = require('../config/env');
const {generateAccessToken,generateRefreshToken} = require('../ultils/jwt');


// Successful login response
const loginResponse = (res, user) => {

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const accessCookieOptions = {
    expires: new Date(
      Date.now() +
      JWT_TOKEN_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'strict'
  };

  const refreshCookieOptions = {
    ...accessCookieOptions
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .json({
      time: currentDateTime(),
      access_token_expires:getDateAfterDuration(JWT_ACCESS_TOKEN_EXPIRES),
      refresh_token_expires:getDateAfterDuration(JWT_REFRESH_TOKEN_EXPIRES),
      result: {
        title: 'SUCCESS',
        message: 'User login successful',
        data: {
          id: user._id,
          email: user.email,
          status: user.status,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
};

module.exports = { loginResponse };