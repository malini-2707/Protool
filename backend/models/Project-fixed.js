import mongoose from 'mongoose';
import User from './User.js';

/**
 * Project Schema for MERN Application
 * Fixed version with proper validation and references
 */
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Project title cannot exceed 100 characters'],
    minlength: [3, 'Project title must be at least 3 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  startDate: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(value) {
        return !value || value <= new Date();
      },
      message: 'Start date cannot be in the future'
    }
  },
  endDate: {
    type: Date,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true; // End date is optional
        const startDate = this.startDate || new Date();
        return value > startDate;
      },
      message: 'End date must be after start date'
    }
  },
  features: [{
    type: String,
    enum: [
      'backlog',
      'sprint_management',
      'issue_tracking',
      'kanban_board',
      'reports',
      'time_tracking',
      'team_management',
      'team_collaboration',
      'notifications'
    ]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project must have a creator']
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'archived'],
    default: 'planning'
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      // Include populated fields
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.startDate || !this.endDate) return null;
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timestamps
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
projectSchema.index({ createdBy: 1, createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text' });

// Static method to create project with user validation
projectSchema.statics.createForUser = async function(projectData, userId) {
  try {
    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create project with validated user
    const project = new this({
      ...projectData,
      createdBy: userId
    });

    return await project.save();
  } catch (error) {
    console.error('Project creation error:', error);
    throw error;
  }
};

const Project = mongoose.model('Project', projectSchema);

export default Project;
