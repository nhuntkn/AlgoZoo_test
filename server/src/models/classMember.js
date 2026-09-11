import mongoose from 'mongoose';

const ClassMemberSchema = new mongoose.Schema(
    {
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true, 
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
            index: true,        
        },
    },
    { timestamps: true } // This automatically adds createdAt/joinedAt
);

// Enforce unique enrollment: A student/trainer can only belong to a class ONCE
ClassMemberSchema.index({ classId: 1, userId: 1 }, { unique: true });

export default mongoose.models.ClassMember || mongoose.model("classMember", ClassMemberSchema);
