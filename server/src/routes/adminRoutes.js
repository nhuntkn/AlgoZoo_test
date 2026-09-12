const router = require('express').Router();
const {isAuthenticatedUser, verifyAdmin} = require('../middlewares/authMiddleware');
const {getUserWithRole,getUser, getUserById, createUser} = require('../controllers/adminController');


// route for admin to
router.route('/admin/get-user').get(isAuthenticatedUser, verifyAdmin,getUser); // get all users information (admin)
router.route('/admin/get-user/:id').get(isAuthenticatedUser, verifyAdmin, getUserById); // get user information by ID (admin)
router.route('/admin/create-user').post(isAuthenticatedUser, verifyAdmin, createUser);  //create a new user with role 'student' or 'trainer'
router.route('/admin/users').get(isAuthenticatedUser, verifyAdmin,getUserWithRole);  // get all users with role 'student' or 'trainer'

module.exports = router;