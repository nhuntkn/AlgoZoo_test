const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      required: [true, 'Full name is required'],
      type: String,
    },
    username: {
      required: [true, "Username is required"],
      type: String,
      unique: true,
      maxLength: [25, "Username cannot exceed 25 characters"],
      trim: true,
    },
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
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student','trainer' ,'admin'],
      default: 'student',
    },
  },
  { timestamps: true } // This automatically adds createdAt and updatedAt
);


// Replace spaces with dashes in username before saving
UserSchema.pre('save', function () {
  if (this.username) {
    this.username = this.username.replace(/\s/g, '-');
  }
});

// Hash password before saving the document
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 8);
});

// Compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
