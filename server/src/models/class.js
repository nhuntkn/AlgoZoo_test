import mongoose from 'mongoose';

const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, 'Class name is required'],
      maxLength: [200, 'Email cannot exceed 200 characters'],
    },
    classDesc: {
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
    },
    trainerJoinToken: {
      type: String,
      unique: true,
    },
    tokenExpiresAt: {
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

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);