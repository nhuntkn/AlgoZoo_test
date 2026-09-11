const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      required: [true, 'Title is required'],
      type: String,
      unique: true,
      maxLength: [255, 'Title cannot exceed 255 characters'],
      trim: true,
    },
    description: {
      required: [true, 'Description is required'],
      type: String,
    },
    problemType: {
      required: [true, 'Problem type is required'],
      type: String,
      enum: ['OS', 'DB', 'DSA', 'OTHER'],
    },
    difficulty: {
      required: [true, 'Difficulty is required'],
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
    },
    createdBy: {
      required: [true, 'Author (created_by) is required'],
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    problemUrl: {
      type: String,
      unique: true,
      sparse: true, // allows multiple documents without problemUrl while keeping the index unique
      maxLength: [500, 'Problem URL cannot exceed 500 characters'],
      trim: true,
    },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Problem', ProblemSchema);
