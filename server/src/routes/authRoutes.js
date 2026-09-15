const router = require('express').Router();
const {isAuthenticatedUser, isRefreshTokenValid} = require('../middlewares/authMiddleware');
const {loginUser, logoutUser, register, refreshToken, getCurrentUser} = require('../controllers/authController');


// routes for register, login and logout user

router.route('/auth/login').post(loginUser);
router.route('/auth/register').post(register);  
router.route('/auth/logout').post(isAuthenticatedUser, logoutUser);
router.route('/auth/me').get(isAuthenticatedUser, getCurrentUser)

// route for get user refresh JWT Token
router.route('/auth/refresh-token').get(isRefreshTokenValid, refreshToken);

module.exports = router;