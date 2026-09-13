const router = require('express').Router();
const {isAuthenticatedUser, verifyAdmin} = require('../middlewares/authMiddleware');
const {getUserWithRole,getUser, getUserById,updateUserActive, createClass, updateClassDetails, updateClassActive, getAllClasses} = require('../controllers/adminController');


// route for admin to
router.route('/admin/get-user').get(isAuthenticatedUser, verifyAdmin,getUser); // get all users information (admin)
router.route('/admin/get-user/:id').get(isAuthenticatedUser, verifyAdmin, getUserById); // get user information by ID (admin)
router.route('/admin/users/:user_id').patch(isAuthenticatedUser, verifyAdmin, updateUserActive); // update user's active status (admin)
router.route('/admin/users').get(isAuthenticatedUser, verifyAdmin,getUserWithRole);  // get all users with role 'student' or 'trainer'
router.route('/admin/classes').post(isAuthenticatedUser, verifyAdmin,createClass);  // create  a classes (admin)
router.route('/admin/classes').get(isAuthenticatedUser, verifyAdmin, getAllClasses);  // get all classes (admin)
router.route('/admin/classes/:class_id').put(isAuthenticatedUser, verifyAdmin,updateClassDetails);  // update class details (admin)
router.route('/admin/classes/:class_id/active').patch(isAuthenticatedUser, verifyAdmin,updateClassActive);  // update class active status (admin)
module.exports = router;