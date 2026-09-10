const mongoose = require('mongoose'); 

const UserSchema = new mongoose.Schema(
  {
    email: {
      required: [true, 'Email is required'],
      type: String,
      unique: true,
      maxLength: [100, 'Email cannot exceed 100 characters'],
      trim: true,
    },
    password: {
      required: [true, 'Password is required'],
      type: String,
      minLength: [6, 'Password must be at least 6 characters'],
      select: false,
    }, 
    avatarUrl:  {
      type: String,
    },
    role: {
      type: String,
      enum: ['student','trainer' ,'admin'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['login', 'logout'],
      default: null
    },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt
);

UserSchema.methods.comparePassword = function (password) {
  return password === this.password;
};
module.exports = mongoose.model('User', UserSchema);
