import express from "express";
import { 
  getSprints, 
  getSprint, 
  createSprint, 
  updateSprint, 
  deleteSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  getSprintBurndown
} from "../controllers/sprint.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// All sprint routes require authentication
router.use(auth);

// Sprint CRUD routes
router.get("/project/:projectId", getSprints);
router.get("/:id", getSprint);
router.post("/project/:projectId", createSprint);
router.put("/:id", updateSprint);
router.delete("/:id", deleteSprint);

// Sprint task management
router.post("/:id/tasks", addTaskToSprint);
router.delete("/:id/tasks/:taskId", removeTaskFromSprint);

// Sprint analytics
router.get("/:id/burndown", getSprintBurndown);

export default router;
