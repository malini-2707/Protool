import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects user has access to
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { 
            members: {
              some: {
                userId: userId
              }
            }
          }
        ]
      },
      include: {
        tasks: true,
        members: true
      }
    });

    const projectIds = projects.map(p => p.id);

    // Get all tasks for these projects
    const tasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Get all sprints for these projects
    const sprints = await prisma.sprint.findMany({
      where: {
        projectId: { in: projectIds }
      }
    });

    // Calculate analytics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const archivedProjects = projects.filter(p => p.status === 'ARCHIVED').length;

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter(t => t.status === 'TODO').length;
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const reviewTasks = tasks.filter(t => t.status === 'REVIEW').length;
    const doneTasks = tasks.filter(t => t.status === 'DONE').length;

    const highPriorityTasks = tasks.filter(t => t.priority === 'HIGH').length;
    const mediumPriorityTasks = tasks.filter(t => t.priority === 'MEDIUM').length;
    const lowPriorityTasks = tasks.filter(t => t.priority === 'LOW').length;

    const activeSprints = sprints.filter(s => s.status === 'ACTIVE').length;
    const completedSprints = sprints.filter(s => s.status === 'COMPLETED').length;

    // Tasks by assignee
    const tasksByAssignee = tasks.reduce((acc, task) => {
      const assigneeName = task.assignee?.name || 'Unassigned';
      if (!acc[assigneeName]) {
        acc[assigneeName] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
      }
      acc[assigneeName].total++;
      if (task.status === 'DONE') acc[assigneeName].completed++;
      else if (task.status === 'IN_PROGRESS') acc[assigneeName].inProgress++;
      else if (task.status === 'TODO') acc[assigneeName].todo++;
      return acc;
    }, {});

    // Recent activities (last 10 tasks updated)
    const recentActivities = tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 10)
      .map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        updatedAt: task.updatedAt,
        projectName: projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'
      }));

    // Project progress
    const projectProgress = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const completedProjectTasks = projectTasks.filter(t => t.status === 'DONE');
      const progress = projectTasks.length > 0 
        ? (completedProjectTasks.length / projectTasks.length) * 100 
        : 0;

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        totalTasks: projectTasks.length,
        completedTasks: completedProjectTasks.length,
        progress: Math.round(progress)
      };
    });

    const analytics = {
      overview: {
        totalProjects,
        activeProjects,
        completedProjects,
        archivedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        reviewTasks,
        doneTasks,
        activeSprints,
        completedSprints
      },
      tasksByPriority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks
      },
      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        review: reviewTasks,
        done: doneTasks
      },
      tasksByAssignee,
      recentActivities,
      projectProgress
    };

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch dashboard analytics" 
    });
  }
};

// Get user's assigned tasks
export const getMyTasks = async (req, res) => {
  try {
    const { status, priority, projectId } = req.query;
    const userId = req.user.id;

    const whereClause = {
      assignedTo: userId
    };

    if (status) whereClause.status = status.toUpperCase();
    if (priority) whereClause.priority = priority.toUpperCase();
    if (projectId) whereClause.projectId = parseInt(projectId);

    // Verify user has access to the project if projectId is specified
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: parseInt(projectId),
          OR: [
            { ownerId: userId },
            { 
              members: {
                some: {
                  userId: userId
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
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            attachments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Get my tasks error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch assigned tasks" 
    });
  }
};

// Get notifications for user
export const getNotifications = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch notifications" 
    });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({ 
        success: false,
        message: "Notification not found" 
      });
    }

    await prisma.notification.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to mark notification as read" 
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to mark all notifications as read" 
    });
  }
};
