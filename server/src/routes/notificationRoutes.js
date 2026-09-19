const router = require('express').Router();
const { isAuthenticatedUser } = require('../middlewares/authMiddleware');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

router.route('/notifications').get(isAuthenticatedUser, getNotifications);
router.route('/notifications/read-all').patch(isAuthenticatedUser, markAllAsRead);
router.route('/notifications/:id/read').patch(isAuthenticatedUser, markAsRead);

module.exports = router;
