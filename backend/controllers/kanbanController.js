import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all tasks for a specific project
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: "Project ID is required" 
      });
    }

    // Fetch tasks with project details
    const tasks = await prisma.task.findMany({
      where: { 
        projectId 
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch tasks" 
    });
  }
};

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    // Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({ 
        success: false,
        error: "Title and Project ID are required" 
      });
    }

    // Validate title length
    if (title.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "Title cannot be empty" 
      });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: "Project not found" 
      });
    }

    // Create new task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        projectId
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

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully"
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create task" 
    });
  }
};

/**
 * Update task status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, description } = req.body;

    // Validate task ID
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: "Task ID is required" 
      });
    }

    // Validate status if provided
    if (status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid status. Must be TODO, IN_PROGRESS, or DONE" 
      });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({ 
        success: false,
        error: "Task not found" 
      });
    }

    // Prepare update data
    const updateData = {};
    if (status) updateData.status = status;
    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: "Title cannot be empty" 
        });
      }
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: task,
      message: "Task updated successfully"
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to update task" 
    });
  }
};

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: "Task ID is required" 
      });
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({ 
        success: false,
        error: "Task not found" 
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete task" 
    });
  }
};

/**
 * Get task by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!id) {
      return res.status(400).json({ 
        success: false,
        error: "Task ID is required" 
      });
    }

    // Find task
    const task = await prisma.task.findUnique({
      where: { id },
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
        error: "Task not found" 
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch task" 
    });
  }
};
