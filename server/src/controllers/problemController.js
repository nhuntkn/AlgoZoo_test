const Problem = require('../models/problem');

// GET /api/problems?search=&difficulty=
exports.listProblems = async (req, res) => {
  try {
    const { search, difficulty } = req.query;

    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (difficulty) {
      if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
        return res.status(400).json({ status: 'error', message: 'Invalid difficulty. Allowed values: Easy, Medium, Hard' });
      }
      query.difficulty = difficulty;
    }

    const problems = await Problem.find(query).select('title difficulty problemType');

    const data = problems.map((p) => ({
      problem_id: p._id,
      title: p.title,
      difficulty: p.difficulty,
      problemType: p.problemType,
    }));

    res.status(200).json({ status: 'success', message: 'Problems retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};

// GET /api/problems/:problem_id
exports.getProblemDetail = async (req, res) => {
  try {
    const { problem_id } = req.params;

    const problem = await Problem.findById(problem_id);
    if (!problem) {
      return res.status(404).json({ status: 'error', message: 'Problem does not exist' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Problem detail retrieved successfully',
      data: {
        problem_id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        problemType: problem.problemType,
        problemUrl: problem.problemUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'SERVER SIDE ERROR' });
  }
};
