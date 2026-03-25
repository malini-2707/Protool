import mongoose from 'mongoose';

/**
 * User Schema for MERN Application
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['MEMBER', 'PROJECT_MANAGER', 'ADMIN'],
    default: 'MEMBER'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { 
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function() {
  if (this.isNew || this.isModified()) {
    this.updatedAt = new Date();
  }
});

// Index for better query performance
// userSchema.index({ email: 1 }); // Removed duplicate index - email already has unique: true

const User = mongoose.model('User', userSchema);

export default User;
