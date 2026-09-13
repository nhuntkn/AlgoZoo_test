const mongoose = require('mongoose'); 

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      maxLength: [200, 'Class name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    studentJoinToken: {
      type: String,
      unique: true,
      sparse: true, // Prevents duplicate key errors if token is temporarily null
    },
    trainerInviteToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    studentJoinTokenExpiresAt: {
      type: Date,
      default: null,
    },
    trainerInviteTokenExpiresAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // This automatically adds createdAt
);

module.exports = mongoose.model("Class", ClassSchema);