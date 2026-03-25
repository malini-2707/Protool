import express from "express";
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask,
  updateTaskOrder
} from "../controllers/task.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// All task routes require authentication
router.use(auth);

// Task CRUD routes
router.get("/project/:projectId", getTasks);
router.get("/:id", getTask);
router.post("/project/:projectId", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Task order management (for drag and drop)
router.put("/order/update", updateTaskOrder);

export default router;
