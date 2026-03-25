import prisma from '../services/prismaService.js';
import { validationResult } from 'express-validator';

/**
 * Project Controller - Prisma Version
 * Handles all project-related operations with proper error handling
 */

/**
 * Create a new project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createProject = async (req, res) => {
  console.log('📝 Creating new project with Prisma...');
  
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
    const userId = req.user?.userId || req.user?.id;
    
    if (!userId) {
      console.log('❌ No user ID found in request');
      return res.status(401).json({ 
        success: false,
        error: 'User authentication required' 
      });
    }

    console.log('👤 Creating project for user:', userId);

    // Extract project data from request body
    const { name, description, features, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || name.trim().length === 0) {
      console.log('❌ Project name is required');
      return res.status(400).json({ 
        success: false,
        error: 'Project name is required' 
      });
    }

    // Prepare project data for Prisma
    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      ownerId: userId,
      features: features || [],
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    };

    console.log('📊 Project data for Prisma:', {
      ...projectData,
      ownerId: userId
    });

    // Create project using Prisma
    const project = await prisma.project.create({
      data: projectData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Project created successfully with Prisma:', project.id);

    // Convert features array to match frontend expectations
    const responseProject = {
      ...project,
      features: project.features || [],
      createdBy: project.owner,
      team: project.members.map(pm => pm.user)
    };

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: responseProject
    });

  } catch (error) {
    console.error('❌ Create project error:', error);
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      console.log('❌ Prisma unique constraint error:', error);
      return res.status(400).json({ 
        success: false,
        error: 'A project with this name already exists' 
      });
    }

    if (error.code === 'P2003') {
      console.log('❌ Prisma foreign key constraint error:', error);
      return res.status(400).json({ 
        success: false,
        error: 'Invalid user reference' 
      });
    }

    if (error.code === 'P2025') {
      console.log('❌ Prisma record not found error:', error);
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Generic server error
    res.status(500).json({ 
      success: false,
      error: 'Failed to create project',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get all projects for the logged-in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserProjects = async (req, res) => {
  console.log('📋 Fetching user projects with Prisma...');
  
  try {
    const userId = req.user?.userId || req.user?.id;
    
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

    // Find projects where user is owner or member
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Get total count for pagination
    const total = await prisma.project.count({
      where: {
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      }
    });

    console.log(`✅ Found ${projects.length} projects`);

    // Convert to match frontend expectations
    const responseProjects = projects.map(project => ({
      ...project,
      features: project.features || [],
      createdBy: project.owner,
      team: project.members.map(pm => pm.user),
      memberCount: project._count.members
    }));

    res.json({
      success: true,
      data: {
        projects: responseProjects,
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
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User authentication required' 
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: { userId: userId }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    // Convert to match frontend expectations
    const responseProject = {
      ...project,
      features: project.features || [],
      createdBy: project.owner,
      team: project.members.map(pm => pm.user)
    };

    res.json({
      success: true,
      data: responseProject
    });

  } catch (error) {
    console.error('❌ Get project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch project',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    const userId = req.user?.userId || req.user?.id;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.ownerId;
    delete updates.createdAt;

    const project = await prisma.project.updateMany({
      where: {
        id: id,
        ownerId: userId // Only owner can update
      },
      data: updates
    });

    if (project.count === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found or no permission' 
      });
    }

    // Fetch updated project
    const updatedProject = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });

  } catch (error) {
    console.error('❌ Update project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update project',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
    const userId = req.user?.userId || req.user?.id;

    const project = await prisma.project.deleteMany({
      where: {
        id: id,
        ownerId: userId // Only owner can delete
      }
    });

    if (project.count === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found or no permission' 
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
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
