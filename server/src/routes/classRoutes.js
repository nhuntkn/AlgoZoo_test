const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { isAuthenticatedUser, verifyAdmin } = require('../middlewares/authMiddleware');

router.post(
  '/:classId/generate-join-link',
  isAuthenticatedUser,
  verifyAdmin,
  classController.generateJoinLink
);

module.exports = router;