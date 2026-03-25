import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get comments for a task
export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check if user has access to the task
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

    const comments = await prisma.comment.findMany({
      where: { taskId: parseInt(taskId) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch comments" 
    });
  }
};

// Create new comment
export const createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Comment content is required" 
      });
    }

    // Check if user has access to the task
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

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: parseInt(taskId),
        authorId: req.user.id
      },
      include: {
        author: {
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
      message: "Comment created successfully",
      comment
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create comment" 
    });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: "Comment content is required" 
      });
    }

    // Check if comment exists and user is the author
    const comment = await prisma.comment.findFirst({
      where: {
        id: parseInt(id),
        authorId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found or insufficient permissions" 
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content: content.trim() },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update comment" 
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if comment exists and user is the author
    const comment = await prisma.comment.findFirst({
      where: {
        id: parseInt(id),
        authorId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: "Comment not found or insufficient permissions" 
      });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete comment" 
    });
  }
};
