import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all sprints for a project
export const getSprints = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
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
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: "Project not found or access denied" 
      });
    }

    const whereClause = {
      projectId: parseInt(projectId)
    };

    if (status) whereClause.status = status.toUpperCase();

    const sprints = await prisma.sprint.findMany({
      where: whereClause,
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            assignedTo: true
          }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      sprints
    });
  } catch (error) {
    console.error("Get sprints error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch sprints" 
    });
  }
};

// Get single sprint by ID
export const getSprint = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
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
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                comments: true,
                attachments: true
              }
            }
          },
          orderBy: [
            { order: 'asc' },
            { createdAt: 'desc' }
          ]
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found" 
      });
    }

    res.json({
      success: true,
      sprint
    });
  } catch (error) {
    console.error("Get sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch sprint" 
    });
  }
};

// Create new sprint
export const createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, startDate, endDate } = req.body;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Sprint name is required" 
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false,
        message: "Start date and end date are required" 
      });
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
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
        message: "Project not found or insufficient permissions" 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ 
        success: false,
        message: "End date must be after start date" 
      });
    }

    const sprintData = {
      name: name.trim(),
      projectId: parseInt(projectId),
      startDate: start,
      endDate: end,
      ...(description && { description: description.trim() })
    };

    const sprint = await prisma.sprint.create({
      data: sprintData,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: "Sprint created successfully",
      sprint
    });
  } catch (error) {
    console.error("Create sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create sprint" 
    });
  }
};

// Update sprint
export const updateSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status } = req.body;

    // Check if user has access to update the sprint
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
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
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found or insufficient permissions" 
      });
    }

    const updateData = {};
    if (name && name.trim() !== '') updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (status) updateData.status = status.toUpperCase();

    // Validate dates if both are provided
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        return res.status(400).json({ 
          success: false,
          message: "End date must be after start date" 
        });
      }
    }

    const updatedSprint = await prisma.sprint.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true
          }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Sprint updated successfully",
      sprint: updatedSprint
    });
  } catch (error) {
    console.error("Update sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update sprint" 
    });
  }
};

// Delete sprint
export const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has access to delete the sprint
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
          ownerId: req.user.id
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found or insufficient permissions" 
      });
    }

    // Remove sprint association from tasks
    await prisma.task.updateMany({
      where: { sprintId: parseInt(id) },
      data: { sprintId: null }
    });

    await prisma.sprint.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Sprint deleted successfully"
    });
  } catch (error) {
    console.error("Delete sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete sprint" 
    });
  }
};

// Add task to sprint
export const addTaskToSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ 
        success: false,
        message: "Task ID is required" 
      });
    }

    // Check if user has access to the sprint
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
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
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found or access denied" 
      });
    }

    // Check if task exists and user has access
    const task = await prisma.task.findFirst({
      where: {
        id: parseInt(taskId),
        project: {
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
        }
      }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found or access denied" 
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { sprintId: parseInt(id) },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Task added to sprint successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Add task to sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to add task to sprint" 
    });
  }
};

// Remove task from sprint
export const removeTaskFromSprint = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    // Check if user has access to the sprint
    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
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
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found or access denied" 
      });
    }

    await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: { sprintId: null }
    });

    res.json({
      success: true,
      message: "Task removed from sprint successfully"
    });
  } catch (error) {
    console.error("Remove task from sprint error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to remove task from sprint" 
    });
  }
};

// Get sprint burndown data
export const getSprintBurndown = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await prisma.sprint.findFirst({
      where: {
        id: parseInt(id),
        project: {
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
        }
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({ 
        success: false,
        message: "Sprint not found" 
      });
    }

    const totalTasks = sprint.tasks.length;
    const completedTasks = sprint.tasks.filter(task => task.status === 'DONE').length;
    const inProgressTasks = sprint.tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const todoTasks = sprint.tasks.filter(task => task.status === 'TODO').length;

    const burndownData = {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      sprint: {
        id: sprint.id,
        name: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        status: sprint.status
      }
    };

    res.json({
      success: true,
      burndown: burndownData
    });
  } catch (error) {
    console.error("Get sprint burndown error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch sprint burndown data" 
    });
  }
};
