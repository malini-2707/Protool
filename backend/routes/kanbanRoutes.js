import express from "express";
const router = express.Router();
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/kanbanController.js";

/**
 * Kanban Board Routes
 * Base path: /api/tasks
 */

// GET /api/tasks/:projectId - Get all tasks for a project
router.get("/:projectId", getTasks);

// GET /api/tasks/task/:id - Get a specific task by ID
router.get("/task/:id", getTaskById);

// POST /api/tasks - Create a new task
router.post("/", createTask);

// PUT /api/tasks/:id - Update a task (status, title, description)
router.put("/:id", updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", deleteTask);

export default router;
