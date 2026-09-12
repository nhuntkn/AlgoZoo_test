const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect, authorize } = require('../middlewares/authMiddleWare');

router.post(
  '/:classId/generate-join-link',
  protect,
  authorize('admin'),
  classController.generateJoinLink
);

module.exports = router;