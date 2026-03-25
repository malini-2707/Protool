import express from "express";
import { 
  getDashboardAnalytics,
  getMyTasks,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(auth);

// Dashboard analytics
router.get("/analytics", getDashboardAnalytics);

// User's tasks
router.get("/my-tasks", getMyTasks);

// Notifications
router.get("/notifications", getNotifications);
router.put("/notifications/:id/read", markNotificationRead);
router.put("/notifications/read-all", markAllNotificationsRead);

export default router;
