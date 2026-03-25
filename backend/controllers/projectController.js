import Project from '../models/Project.js';
import { validationResult } from 'express-validator';

/**
 * Project Controller
 * Handles all project-related operations
 */

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createProject = async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, startDate, endDate, features } = req.body;
    const createdBy = req.user.userId; // From JWT middleware

    // Create new project
    const project = new Project({
      title: title.trim(),
      description: description?.trim() || '',
      startDate: startDate || new Date(),
      endDate: endDate ? new Date(endDate) : null,
      features: features || [],
      createdBy
    });

    // Save project to database
    const savedProject = await project.save();

    // Populate creator information
    await savedProject.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: savedProject
    });

  } catch (error) {
    console.error('Create project error:', error);
    
    // Handle duplicate key error (title uniqueness)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A project with this title already exists'
      });
    }

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
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find projects created by user
    const projects = await Project.find({ createdBy: userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Project.countDocuments({ createdBy: userId });

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
    console.error('Get projects error:', error);
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
    const userId = req.user.userId;

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
    console.error('Get project error:', error);
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
    const userId = req.user.userId;
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
    console.error('Update project error:', error);
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
    const userId = req.user.userId;

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
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      message: error.message
    });
  }
};
