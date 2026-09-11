const SubmissionSchema = new mongoose.Schema(
  {
    class_problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassProblem',
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content_blocks: [
      {
        text: { type: String, required: true },
        image: { type: String, required: true },
        code: { type: String, required: true },
      },
    ],
    is_late: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'late', 'review'],
      default: 'pending',
    },
    feedback: { type: String, default: '' },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewed_at: { type: Date, default: null },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);