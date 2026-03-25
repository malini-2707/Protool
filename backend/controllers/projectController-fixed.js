import Project from '../models/Project-fixed.js';
import { validationResult } from 'express-validator';

/**
 * Project Controller - Fixed Version
 * Handles all project-related operations with proper error handling
 */

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createProject = async (req, res) => {
  console.log('📝 Creating new project...');
  
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Get user ID from JWT middleware
    const userId = req.user?.userId;
    
    if (!userId) {
      console.log('❌ No user ID found in request');
      return res.status(401).json({ 
        success: false,
        error: 'User authentication required' 
      });
    }

    console.log('👤 Creating project for user:', userId);

    // Extract project data from request body
    const { title, description, startDate, endDate, features } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      console.log('❌ Project title is required');
      return res.status(400).json({ 
        success: false,
        error: 'Project title is required' 
      });
    }

    // Prepare project data
    const projectData = {
      title: title.trim(),
      description: description?.trim() || '',
      startDate: startDate || new Date(),
      endDate: endDate || null,
      features: features || []
    };

    console.log('📊 Project data:', {
      ...projectData,
      createdBy: userId
    });

    // Create project using the static method
    const project = await Project.createForUser(projectData, userId);

    console.log('✅ Project created successfully:', project._id);

    // Populate creator information
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });

  } catch (error) {
    console.error('❌ Create project error:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      console.log('❌ Mongoose validation error:', error.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validation error',
        details: error.message 
      });
    }

    if (error.code === 11000) {
      console.log('❌ Duplicate key error:', error);
      return res.status(400).json({ 
        success: false,
        error: 'A project with this title already exists' 
      });
    }

    if (error.message === 'Invalid user ID' || error.message === 'User not found') {
      console.log('❌ User validation error:', error.message);
      return res.status(401).json({ 
        success: false,
        error: error.message 
      });
    }

    // Generic server error
    res.status(500).json({ 
      success: false,
      error: 'Failed to create project',
      message: error.message 
    });
  }
};

/**
 * Get all projects for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserProjects = async (req, res) => {
  console.log('📋 Fetching user projects...');
  
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User authentication required' 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('👤 Fetching projects for user:', userId);

    // Find projects created by user
    const projects = await Project.find({ createdBy: userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Project.countDocuments({ createdBy: userId });

    console.log(`✅ Found ${projects.length} projects`);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get projects error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch projects',
      message: error.message 
    });
  }
};

/**
 * Get a single project by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User authentication required' 
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid project ID' 
      });
    }

    const project = await Project.findOne({ _id: id, createdBy: userId })
      .populate('createdBy', 'name email')
      .populate('team', 'name email');

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch project',
      message: error.message 
    });
  }
};

/**
 * Update a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user?.userId;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates.createdAt;

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update project',
      message: error.message 
    });
  }
};

/**
 * Delete a project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findOneAndDelete({ _id: id, createdBy: userId });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete project',
      message: error.message 
    });
  }
};
