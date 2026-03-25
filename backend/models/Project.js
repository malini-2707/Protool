import mongoose from 'mongoose';

/**
 * Project Schema for MERN Application
 * Similar to Jira project structure
 */
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Project title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
    validate: {
      validator: function(value) {
        return !value || !this.startDate || value > this.startDate;
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
  }],
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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

const Project = mongoose.model('Project', projectSchema);

export default Project;
