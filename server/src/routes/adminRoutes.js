const router = require('express').Router();
const {isAuthenticatedUser, verifyAdmin} = require('../middlewares/authMiddleware');
const {getUser,getUserById,createUser} = require('../controllers/adminController');


// routes for admin 

router.route('/admin/get-user').get(isAuthenticatedUser, verifyAdmin,getUser);
router.route('/admin/get-user/:id').get(isAuthenticatedUser, verifyAdmin, getUserById);
router.route('/admin/create-user').post(isAuthenticatedUser, verifyAdmin, createUser);

module.exports = router;