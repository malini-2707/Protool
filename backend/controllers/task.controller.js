import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all tasks for a project
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
      projectId: projectId
    };

    if (status) whereClause.status = status.toUpperCase();

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch tasks" 
    });
  }
};

// Get single task by ID
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: {
        id: id,
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
        }
      }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: "Task not found" 
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch task" 
    });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;

    // Validate input
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Task title is required" 
      });
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    const taskData = {
      title: title.trim(),
      projectId: projectId,
      ...(description && { description: description.trim() })
    };

    const task = await prisma.task.create({
      data: taskData
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create task",
      error: error.message
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: id,
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

    const updateData = {};
    if (title && title.trim() !== '') updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (status) updateData.status = status.toUpperCase();

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: updateData
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update task" 
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has access to delete the task
    const task = await prisma.task.findFirst({
      where: {
        id: id,
        project: {
          OR: [
            { ownerId: req.user.id },
            { 
              members: {
                some: {
                  userId: req.user.id,
                  role: 'ADMIN' // Simplified permission
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
        message: "Task not found or insufficient permissions" 
      });
    }

    await prisma.task.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete task" 
    });
  }
};

// Update task order (for drag and drop) 
// Kept for signature compatibility but simplified due to no 'order' column
export const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body; 

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Tasks array is required" 
      });
    }

    // Verify user has access to all tasks
    const taskIds = tasks.map(t => t.id);
    const existingTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
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

    if (existingTasks.length !== taskIds.length) {
      return res.status(404).json({ 
        success: false,
        message: "Some tasks not found or access denied" 
      });
    }

    // Only update status if provided (since we removed order column)
    await prisma.$transaction(
      tasks.map(({ id, status }) =>
        prisma.task.update({
          where: { id: id },
          data: {
            ...(status && { status: status.toUpperCase() })
          }
        })
      )
    );

    res.json({
      success: true,
      message: "Task status updated successfully"
    });
  } catch (error) {
    console.error("Update task order error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update task status" 
    });
  }
};
