const router = require('express').Router();
const { isAuthenticatedUser, verifyTrainer } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');
const { listProblems, getProblemDetail } = require('../controllers/problemController');

// routes for problem bank (browse LeetCode-style problems)

router.route('/problems').get(isAuthenticatedUser, verifyTrainer, listProblems);
router
  .route('/problems/:problem_id')
  .get(isAuthenticatedUser, verifyTrainer, validateObjectId('problem_id'), getProblemDetail);

module.exports = router;
