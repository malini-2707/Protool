import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all projects for the authenticated user
export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause = {
      OR: [
        { ownerId: req.user.id },
        { 
          members: {
            some: {
              userId: req.user.id
            }
          }
        }
      ]
    };

    const totalProjects = await prisma.project.count({ where: whereClause });

    const projects = await prisma.project.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
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
        tasks: {
          select: {
            id: true,
            status: true,
            title: true
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total: totalProjects,
          pages: Math.ceil(totalProjects / limit)
        }
      }
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch projects" 
    });
  }
};

// Get single project by ID
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: id, // It's a UUID string in Prisma
        OR: [
          { ownerId: req.user.id },
          { 
            members: {
              some: {
                userId: req.user.id
              }
            }
          }
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
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
        tasks: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        features: true
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found" 
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to fetch project" 
    });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, features } = req.body;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Project name is required" 
      });
    }

    const projectData = {
      name: name.trim(),
      ownerId: req.user.id,
      ...(description && { description: description.trim() }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) })
    };

    if (features && Array.isArray(features) && features.length > 0) {
      projectData.features = {
        create: features.map(f => ({ feature: f }))
      };
    }

    const project = await prisma.project.create({
      data: projectData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        features: true,
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      }
    });

    // Add owner as project member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: req.user.id,
        role: 'ADMIN'
      }
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create project" 
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status, features } = req.body;

    // Check if user has permission to update project
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: req.user.id },
          { 
            members: {
              some: {
                userId: req.user.id,
                role: 'ADMIN'
              }
            }
          }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found or insufficient permissions" 
      });
    }

    const updateData = {};
    if (name && name.trim() !== '') updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (status) updateData.status = status.toUpperCase();
    if (features && Array.isArray(features)) {
      updateData.features = {
        deleteMany: {}, // Clean slate
        create: features.map(f => ({ feature: f }))
      };
    }

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to update project" 
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is the project owner
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        ownerId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found or insufficient permissions" 
      });
    }

    await prisma.project.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete project" 
    });
  }
};

// Add member to project
export const addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role = 'MEMBER' } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        error: "User ID is required" 
      });
    }

    // Check if user has permission to add members
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: req.user.id },
          { 
            members: {
              some: {
                userId: req.user.id,
                role: 'ADMIN'
              }
            }
          }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found or insufficient permissions" 
      });
    }

    // Check if user exists
    const userToAdd = await prisma.user.findUnique({
      where: { id: userId } // User IDs are strings (UUIDs)
    });

    if (!userToAdd) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId
        }
      }
    });

    if (existingMember) {
      return res.status(409).json({ 
        success: false,
        error: "User is already a member of this project" 
      });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: userId,
        role: role.toUpperCase()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member
    });
  } catch (error) {
    console.error("Add project member error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to add member to project" 
    });
  }
};

// Remove member from project
export const removeProjectMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    // Check if user has permission to remove members
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        OR: [
          { ownerId: req.user.id },
          { 
            members: {
              some: {
                userId: req.user.id,
                role: 'ADMIN'
              }
            }
          }
        ]
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found or insufficient permissions" 
      });
    }

    // Cannot remove the project owner
    if (memberId === project.ownerId) {
      return res.status(400).json({ 
        success: false,
        error: "Cannot remove project owner from members" 
      });
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: memberId
        }
      }
    });

    res.json({
      success: true,
      message: "Member removed successfully"
    });
  } catch (error) {
    console.error("Remove project member error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to remove member from project" 
    });
  }
};
