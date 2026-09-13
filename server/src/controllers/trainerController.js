const mongoose = require('mongoose');
const Class = require('../models/class');
const ClassMember = require('../models/classMember');
const ClassProblem = require('../models/classProblem');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { checkTrainerOwnsClass } = require('../utils/classOwnership');

// Helper: class ids a trainer belongs to
const getTrainerClassIds = async (trainerId) => {
  return ClassMember.find({ userId: trainerId }).distinct('classId');
};

// GET /api/trainer/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const trainerId = req.user._id;

    const classIds = await getTrainerClassIds(trainerId);
    const classProblemIds = await ClassProblem.find({ class_id: { $in: classIds } }).distinct('_id');
    const pendingReviewCount = await Submission.countDocuments({
      class_problem_id: { $in: classProblemIds },
      status: { $in: ['pending', 'late'] },
    });

    res.status(200).json({
      status: 'success',
      message: 'Trainer dashboard retrieved successfully',
      data: {
        classCount: classIds.length,
        pendingReviewCount,
        problemCount: classProblemIds.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/trainer/classes  (trainer: own classes | admin: all classes)
exports.getClasses = async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'admin') {
      classes = await Class.find();
    } else {
      const classIds = await getTrainerClassIds(req.user._id);
      classes = await Class.find({ _id: { $in: classIds } });
    }

    const data = await Promise.all(
      classes.map(async (cls) => {
        const members = await ClassMember.find({ classId: cls._id }).populate('userId', 'role');
        const studentCount = members.filter((m) => m.userId && m.userId.role === 'student').length;
        return {
          class_id: cls._id,
          className: cls.name,
          student_count: studentCount,
        };
      })
    );

    res.status(200).json({ status: 'success', message: 'Classes retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/trainer/classes/:class_id  (trainer: must be a member | admin: any class)
exports.getClassDetail = async (req, res) => {
  try {
    const { class_id } = req.params;

    const cls = await Class.findById(class_id);
    if (!cls) {
      return res.status(404).json({ status: 'error', message: 'Class does not exist' });
    }

    if (req.user.role !== 'admin') {
      const owns = await checkTrainerOwnsClass(req.user._id, class_id);
      if (!owns) {
        return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
      }
    }

    // Always computed live from ClassProblem — reflects new assignments immediately,
    // never a cached/stale count.
    const classProblemIds = await ClassProblem.find({ class_id }).distinct('_id');
    const members = await ClassMember.find({ classId: class_id }).populate('userId', 'fullname role');
    const students = members.filter((m) => m.userId && m.userId.role === 'student');

    const studentData = await Promise.all(
      students.map(async (m) => {
        const completedTasks = await Submission.countDocuments({
          student_id: m.userId._id,
          class_problem_id: { $in: classProblemIds },
          status: { $ne: 'pending' },
        });
        return {
          user_id: m.userId._id,
          name: m.userId.fullname,
          completed_tasks: completedTasks,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'Class detail retrieved successfully',
      data: {
        class_id: cls._id,
        className: cls.name,
        total_problems: classProblemIds.length,
        students: studentData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// POST /api/trainer/classes/:class_id/problems  (trainer only, must own the class)
exports.assignProblemToClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { problem_id, deadline } = req.body;

    if (!problem_id) {
      return res.status(400).json({ status: 'error', message: 'problem_id is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(problem_id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid problem_id format' });
    }

    const cls = await Class.findById(class_id);
    if (!cls) {
      return res.status(404).json({ status: 'error', message: 'Class does not exist' });
    }

    const owns = await checkTrainerOwnsClass(req.user._id, class_id);
    if (!owns) {
      return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
    }

    const problem = await Problem.findById(problem_id);
    if (!problem) {
      return res.status(404).json({ status: 'error', message: 'Problem does not exist' });
    }

    const classProblem = await ClassProblem.create({
      class_id,
      problem_id,
      assigned_by: req.user._id,
      deadline: deadline || null,
    });

    res.status(201).json({
      status: 'success',
      message: 'Problem assigned to class successfully',
      data: { assigned_problem: classProblem },
    });
  } catch (error) {
    // Duplicate (class_id, problem_id) — blocked by the unique index on ClassProblem
    if (error.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'This problem is already assigned to this class' });
    }
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/trainer/classes/:class_id/problems?search=&status=  (trainer only, must own the class)
exports.getClassProblems = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { search } = req.query;

    const cls = await Class.findById(class_id);
    if (!cls) {
      return res.status(404).json({ status: 'error', message: 'Class does not exist' });
    }

    const owns = await checkTrainerOwnsClass(req.user._id, class_id);
    if (!owns) {
      return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
    }

    const query = { class_id };
    if (search) {
      const matchingProblemIds = await Problem.find({ title: { $regex: search, $options: 'i' } }).distinct('_id');
      query.problem_id = { $in: matchingProblemIds };
    }
    // NOTE: `status` filter is not applied yet — ClassProblem has no submission-status concept
    // of its own today. Left as a no-op placeholder for now (see chat: "có thể mở rộng sau").

    const classProblems = await ClassProblem.find(query).populate('problem_id', 'title difficulty problemType');

    const data = classProblems.map((cp) => ({
      class_id: cp.class_id,
      problem_id: cp.problem_id ? cp.problem_id._id : null,
      title: cp.problem_id ? cp.problem_id.title : null,
      difficulty: cp.problem_id ? cp.problem_id.difficulty : null,
      deadline: cp.deadline,
      created_at: cp.created_at,
    }));

    res.status(200).json({ status: 'success', message: 'Class problems retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// DELETE /api/trainer/classes/:class_id/problems/:problem_id  (trainer only, must own the class)
exports.deleteClassProblem = async (req, res) => {
  try {
    const { class_id, problem_id } = req.params;

    const owns = await checkTrainerOwnsClass(req.user._id, class_id);
    if (!owns) {
      return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
    }

    const classProblem = await ClassProblem.findOne({ class_id, problem_id });
    if (!classProblem) {
      return res.status(404).json({ status: 'error', message: 'This problem is not assigned to this class' });
    }

    const hasSubmission = await Submission.exists({ class_problem_id: classProblem._id });
    if (hasSubmission) {
      return res.status(409).json({
        status: 'error',
        message: 'Cannot remove this problem: students have already submitted work for it.',
      });
    }

    await ClassProblem.deleteOne({ _id: classProblem._id });

    res.status(200).json({ status: 'success', message: 'Problem removed from class successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// PUT /api/trainer/review/:submission_id  (trainer only, must own the class the submission belongs to)
exports.reviewSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const { feedback } = req.body;

    const submission = await Submission.findById(submission_id);
    if (!submission) {
      return res.status(404).json({ status: 'error', message: 'Submission does not exist' });
    }

    const classProblem = await ClassProblem.findById(submission.class_problem_id);
    if (!classProblem) {
      return res.status(404).json({ status: 'error', message: 'Related class problem does not exist' });
    }

    const owns = await checkTrainerOwnsClass(req.user._id, classProblem.class_id);
    if (!owns) {
      return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
    }

    // Reviewing a submission moves it to the 'review' status (pending/late only describe
    // on-time vs late at submit time; 'review' means the trainer has given feedback).
    submission.feedback = feedback || '';
    submission.status = 'review';
    submission.reviewed_by = req.user._id;
    submission.reviewed_at = Date.now();
    await submission.save();

    res.status(200).json({
      status: 'success',
      message: 'Submission reviewed successfully',
      data: {
        submission_id: submission._id,
        status: submission.status,
        feedback: submission.feedback,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/trainer/submissions?student=&problem=&status=
exports.getSubmissions = async (req, res) => {
  try {
    const { student, problem, status } = req.query;

    const classIds = await getTrainerClassIds(req.user._id);
    const classProblemFilter = { class_id: { $in: classIds } };
    if (problem) {
      classProblemFilter.problem_id = problem;
    }
    const classProblemIds = await ClassProblem.find(classProblemFilter).distinct('_id');

    const query = { class_problem_id: { $in: classProblemIds } };
    if (student) query.student_id = student;
    if (status) query.status = status;

    const submissions = await Submission.find(query)
      .populate('student_id', 'fullname')
      .populate({ path: 'class_problem_id', populate: { path: 'problem_id', select: 'title' } });

    const data = submissions.map((s) => ({
      submission_id: s._id,
      student: s.student_id ? { id: s.student_id._id, name: s.student_id.fullname } : null,
      problem: s.class_problem_id && s.class_problem_id.problem_id
        ? { id: s.class_problem_id.problem_id._id, title: s.class_problem_id.problem_id.title }
        : null,
      status: s.status,
    }));

    res.status(200).json({ status: 'success', message: 'Submissions retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/trainer/submissions/:submission_id
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { submission_id } = req.params;

    const submission = await Submission.findById(submission_id)
      .populate('student_id', 'fullname')
      .populate({ path: 'class_problem_id', populate: { path: 'problem_id', select: 'title' } });

    if (!submission) {
      return res.status(404).json({ status: 'error', message: 'Submission does not exist' });
    }

    const owns = await checkTrainerOwnsClass(req.user._id, submission.class_problem_id.class_id);
    if (!owns) {
      return res.status(403).json({ status: 'error', message: 'Access denied. You are not a member of this class.' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Submission detail retrieved successfully',
      data: {
        submission_id: submission._id,
        content_blocks: submission.content_blocks,
        student: submission.student_id ? { id: submission.student_id._id, name: submission.student_id.fullname } : null,
        problem: submission.class_problem_id && submission.class_problem_id.problem_id
          ? { id: submission.class_problem_id.problem_id._id, title: submission.class_problem_id.problem_id.title }
          : null,
        status: submission.status,
        feedback: submission.feedback,
        submitted_at: submission.createdAt, // submission has no dedicated submitted_at field; createdAt (from timestamps) serves that purpose
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
