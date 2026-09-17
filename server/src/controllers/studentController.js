const ClassProblem = require('../models/classProblem');
const Submission = require('../models/submission');
const ClassMember = require('../models/classMember');
const {getDisplayStatus} = require('../utils/submissionStatus');
require('../models/problem')

/**
 * Get student progress dashboard stats for a specific class
 * GET /api/student/classes/:classId/dashboard 
 */
exports.getStudentDashboardStats = async (req, res) => {
    try {
        const {classId} = req.params;
        const studentId = req.user._id || req.user.id;

        //1. Fetch all assigned problems for this class and populate details & class info
        const classProblems = await ClassProblem.find({class_id: classId})
            .populate('problem_id', 'title problemType difficulty problemUrl')
            .populate('class_id', 'name')
            .lean();

        const totalProblems = classProblems.length;

        if (!totalProblems) {
            return res.status(200).json({
                status: 'success',
                data: {
                    stats: {
                        totalProblems: 0,
                        submittedCount: 0,
                        reviewedCount: 0,
                        pendingReviewCount: 0,
                    },
                    upcomingDeadlines: [],
                    recentSubmissions: [],
                },
            });
        }

        const classProblemIds = classProblems.map((cp) => cp._id);

        //Map class problems by _id for quick lookup
        const classProblemMap = new Map();
        classProblems.forEach((cp) => {
            classProblemMap.set(cp._id.toString(), cp);
        });

        //2. Fetch all submissions by this student for these class problems
        const submissions = await Submission.find({
            student_id: studentId,
            class_problem_id: {$in: classProblemIds},
        })
            .sort({createdAt: -1})
            .lean();

        //Map submissions by class_problem_id for quick lookup
        const submissionMap = new Map();
        submissions.forEach((sub) => {
            submissionMap.set(sub.class_problem_id.toString(), sub);
        });

        //3. Calculate stat cards
        let reviewedCount = 0;
        let pendingReviewCount = 0;
        
        submissions.forEach((sub) => {
            if (sub.status === 'review') {
                reviewedCount++;
            } else {
                pendingReviewCount++;
            }
        });

        const submittedCount = submissions.length;

        //4. Build upcoming deadlines (Unsubmitted or Pending problems with future/recent deadlines)
        const now = new Date();
        const upcomingDeadlines = classProblems
            .filter((cp) => {
                const sub = submissionMap.get(cp._id.toString());
                //Show unsubmitted problems or problems with upcoming deadlines
                return !sub && cp.deadline;
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 5)
            .map((cp) => {
                const deadlineDate = new Date(cp.deadline);
                const diffTime = deadlineDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return {
                    classProblemId: cp._id,
                    title: cp.problem_id?.title || 'Untitled Problem',
                    className: cp.class_id?.name || 'Class',
                    deadline: cp.deadline,
                    daysLeft: diffDays > 0 ? `${diffDays}d` : 'Overdue',
                };
            });
        
        //5. Build Recent Submissions list
        const recentSubmissions = submissions.slice(0, 5).map((sub) => {
            const parentCP = classProblemMap.get(sub.class_problem_id.toString());

            return {
                submissionId: sub._id,
                classProblemId: sub.class_problem_id,
                title: parentCP?.problem_id?.title || 'Untitled Problem',
                className: parentCP?.class_id?.name || 'Class',
                status: getDisplayStatus(sub),
                feedback: sub.feedback || '',
                submittedAt: sub.createdAt, 
            };
        });

        return res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalProblems, 
                    submittedCount, 
                    reviewedCount,
                    pendingReviewCount,
                },
                upcomingDeadlines,
                recentSubmissions,
            },
        });
    } catch (error) {
        console.error('getStudentDashboardStats Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
        });
    }
};

/**
 * Get all classes the logged-in student is enrolled in
 * GET /api/student/classes
 */
exports.getStudentClasses = async (req, res) => {
    try {
        const studentId = req.user._id || req.user.id;

        // Find class membership records for this student
        const memberships = await ClassMember.find({userId: studentId})
            .populate('classId', 'name description isActive')
            .lean();

        const validMembership = memberships.filter((m) => m.classId)
        const classIds = validMembership.map((m) =>  m.classId._id);

        // Member roles live on the User model, not on ClassMember, so join to count them in the DB
        const memberCounts = await ClassMember.aggregate([
            { $match: { classId: { $in: classIds } } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $group: {
                    _id: '$classId',
                    totalStudents: { $sum: { $cond: [{ $eq: ['$user.role', 'student'] }, 1, 0] } },
                    totalTrainers: { $sum: { $cond: [{ $eq: ['$user.role', 'trainer'] }, 1, 0] } },
                },
            },
        ]);

        const countMap = new Map();
        memberCounts.forEach((item) => {
            countMap.set(item._id.toString(), item);
        });

        // 3. Format result
        const classes = validMembership.map((m) => {
            const counts = countMap.get(m.classId._id.toString()) || {
                totalStudents: 0,
                totalTrainers: 0,
            };

            return {
                classId: m.classId._id,
                name: m.classId.name,
                description: m.classId.description,
                isActive: m.classId.isActive,
                joinedAt: m.createdAt,
                totalStudents: counts.totalStudents,
                totalTrainers: counts.totalTrainers,
            };
        });

        return res.status(200).json({
            status: 'success',
            data: classes,
        });
    } catch (error) {
        console.error('getStudentClasses Error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'SERVER SIDE ERROR' 
        });
    }
};



/**
 * Get problem list for a specific class
 * GET /routes/student/classes/:classId/problems
 */
exports.getStudentClassProblems = async (req, res) => {
    try {
        const { classId } = req.params;
        const studentId = req.user._id;
        const now = new Date();

        // 1. Fetch ClassProblem documents matching class_id and populate problem_id
        const classProblems = await ClassProblem.find({ class_id: classId })
            .populate('problem_id', 'title problemType difficulty problemUrl')
            .lean();

        if (!classProblems.length) {
            return res.status(200).json({
                status: 'success',
                data: [],
            });
        }

        const classProblemIds = classProblems.map((cp) => cp._id);

        // 2. Fetch student's submissions using snake_case schema field names
        const userSubmissions = await Submission.find({
            student_id: studentId,
            class_problem_id: { $in: classProblemIds },
        }).lean();

        const submissionMap = new Map();
        userSubmissions.forEach((sub) => {
            submissionMap.set(sub.class_problem_id.toString(), sub);
        });

        // 3. Map result array with status tags
        const result = classProblems.map((cp) => {
            const submission = submissionMap.get(cp._id.toString());

            // Countdown calculation
            let daysLeft = null;
            let isOverdue = false;

            if (cp.deadline) {
                const deadlineDate = new Date(cp.deadline);
                const diffTime = deadlineDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    isOverdue = true;
                    daysLeft = 'Overdue';
                } else {
                    daysLeft = `${diffDays}d`;
                }
            }

            return {
                classProblemId: cp._id,
                deadline: cp.deadline,
                daysLeft,
                isOverdue,
                status: getDisplayStatus(submission),
                problem: cp.problem_id
                    ? {
                        id: cp.problem_id._id,
                        title: cp.problem_id.title,
                        problemType: cp.problem_id.problemType,
                        difficulty: cp.problem_id.difficulty,
                        problemUrl: cp.problem_id.problemUrl,
                    }
                    : null,
            };
        });

        return res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        console.error('getStudentClassProblems Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
        });
    }
};

/**
 * Get problem details by classProblemId
 * GET /routes/student/problems/:classProblemId
 */
exports.getStudentProblemDetail = async (req, res) => {
    try {
        const { classProblemId } = req.params;
        const studentId = req.user._id;

        // 1. Query ClassProblem by ID and populate problem_id
        const classProblem = await ClassProblem.findById(classProblemId)
            .populate('problem_id')
            .lean();

        if (!classProblem) {
            return res.status(404).json({
                status: 'error',
                message: 'Assigned problem not found',
            });
        }

        // 2. Fetch existing submission matching student_id & class_problem_id
        const submission = await Submission.findOne({
            student_id: studentId,
            class_problem_id: classProblem._id,
        })
            .populate('content_blocks.file_id')
            .populate('reviewed_by', 'fullname')
            .lean();

        return res.status(200).json({
            status: 'success',
            data: {
                classProblemId: classProblem._id,
                classId: classProblem.class_id,
                deadline: classProblem.deadline,
                status: getDisplayStatus(submission),
                submission: submission
                    ? {
                        id: submission._id,
                        contentBlocks: submission.content_blocks,
                        isLate: submission.is_late,
                        status: submission.status,
                        feedback: submission.feedback,
                        reviewedBy: submission.reviewed_by,
                        reviewedAt: submission.reviewed_at,
                        createdAt: submission.createdAt,
                    }
                    : null,
                problem: classProblem.problem_id
                    ? {
                        id: classProblem.problem_id._id,
                        title: classProblem.problem_id.title,
                        description: classProblem.problem_id.description,
                        problemType: classProblem.problem_id.problemType,
                        difficulty: classProblem.problem_id.difficulty,
                        problemUrl: classProblem.problem_id.problemUrl,
                    }
                    : null,
            },
        });
    } catch (error) {
        console.error('getStudentProblemDetail Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
        });
    }
};

/**
 * Get student submissions
 * GET /api/student/submissions?classId=...&status=...&page=1&limit=15
 */
exports.getStudentSubmissions = async(req, res) => {
    try {
        const studentId = req.user._id || req.user.id;
        const {classId, status, page = 1, limit = 15} = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 15;
        const skip = (pageNum - 1) * limitNum;

        //construct query filter
        const query = {student_id: studentId};

        if(status && status.toLowerCase() !== 'all') {
            query.status = status.toLowerCase();
        }

        //Filter by classId via ClassProblem IDs if provided
        if (classId && classId.toLowerCase() !== 'all') {
            const classProblems = await ClassProblem.find({class_id: classId}).select('_id').lean();
            const classProblemIds = classProblems.map((cp) => cp._id);
            query.class_problem_id = {$in: classProblemIds};
        }

        //Fetch submissions with populated relations
        const [submissions, totalCount] = await Promise.all([
            Submission.find(query)
                .populate({
                    path: 'class_problem_id',
                    select: 'problem_id class_id, deadline',
                    populate: [
                        {path: 'problem_id', select: 'title problemType difficulty'},
                        {path: 'class_id', select: 'name'},
                    ],
                })
                .sort({createdAt: -1})
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Submission.countDocuments(query),
        ]);

        //Format response
        const formattedSubmissions = submissions.map((sub) => {
            const classProblem = sub.class_problem_id;
            const problem = classProblem?.problem_id;
            const classInfo = classProblem?.class_id;

            return {
                submissionId: sub._id,
                classProblemId: classProblem?._id,
                problemTitle: problem?.title || 'Untitled Problem',
                problemType: problem?.problemType || null,
                difficulty: problem?.difficulty || null,
                className: classInfo?.name || 'Unassigned Class',
                status: getDisplayStatus(sub),
                isLate: sub.is_late,
                submittedAt: sub.createdAt,
            };
        });

        return res.status(200).json({
            status: 'success',
            data: formattedSubmissions,
            pagination: {
                totalItems: totalCount,
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
            },
        });
    } catch (error) {
        console.error('getStudentSubmissions Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR',
        })
    }
}

/**
 * Create or update student submission
 * POST /api/student/submissions
 */

exports.createStudentSubmission = async (req, res) => {
    try {
        const studentId = req.user._id || req.user.id;
        const {class_problem_id, type, content, language, file_id, filename, content_blocks} = req.body;

        if (!class_problem_id) {
            return res.status(400).json({
                status: 'error',
                message: 'class_problem_id is required',
            });
        }

        //1. Prevent multiple submission
        const existingSubmission = await Submission.findOne({
            student_id: studentId,
            class_problem_id,
        }).lean();

        if (existingSubmission) {
            return res.status(409).json({
                status: 'error',
                message: 'You have already submitted a solution for this problem. Re-submissions are not allowed.',
            });
        }

        //2. Fetch ClassProblem to verify existence and check deadline
        const classProblem = await ClassProblem.findById(class_problem_id)
            .populate('problem_id', 'problemType')    
            .lean();

        if (!classProblem || !classProblem.problem_id) {
            return res.status(404).json({
                status: 'error',
                message: 'Assigned class problem not found'
            });
        }

        //3. Validate payload if sending a single block via submission_type
        const typeLower = type ? type.toLowerCase() : null;

        if (typeLower) {
            if (typeLower === 'code' && !content) {
                return res.status(400).json({
                    status: 'error',
                    message: 'content is required for code submission type'
                });
            }
            if (typeLower === 'text' && !content) {
                return res.status(400).json({
                    status: 'error',
                    message: 'content is required for text submission type'
                });
            }
            if ((typeLower === 'image' || typeLower === 'file') && !file_id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'file_id is required for image/file submission type'
                });
            }
        }

        //4. Construct content_blocks to match contentBlockSchema
        const blocks = content_blocks || [
            {
                type: typeLower,
                content: content || undefined, 
                language: language || undefined,
                file_id: file_id || undefined,
                filename: filename || undefined,
            },
        ];

        if (!blocks.length) {
            return res.status(400).json({
                status: 'error',
                message: 'At least one content block is required'
            });
        }

        //5. Validate block structure based on Problem Type
        const problemType = classProblem.problem_id.problemType;

        if (problemType === 'DSA') {
            const hasCodeOrText = blocks.some(b => b.type === 'code' || b.type === 'text');
            const hasImageOrFile = blocks.some(b => b.type === 'image' || b.type === 'file');

            if (!hasCodeOrText || !hasImageOrFile) {
                return res.status(400).json({
                    status: 'error',
                    message: 'DSA problems require at least one code/text block and one image/file screenshot proof.',
                });
            }
        } else {
            if (blocks.length < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: `${problemType} problems require at least 1 content block.`,
                });
            }
        }

        //6. Evaluate deadline
        const submittedAt = new Date();
        const isLate = classProblem.deadline ? submittedAt > new Date(classProblem.deadline) : false;
        const submissionStatus = isLate ? 'late' : 'pending';

        //7. Save submission
        const submission = await Submission.create(
            {
                student_id: studentId,
                class_problem_id,
                content_blocks: blocks,
                is_late: isLate,
                status: submissionStatus,
            });

        return res.status(201).json({
            status: 'success',
            message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully',
            data: submission,
        });
    } catch (error) {
        console.error('createStudentSubmission Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'SERVER SIDE ERROR'
        });
    }
};


