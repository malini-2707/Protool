import express from "express";
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  addProjectMember,
  removeProjectMember
} from "../controllers/project.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// All project routes require authentication
router.use(auth);

// Project CRUD routes
router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Project member management
router.post("/:id/members", addProjectMember);
router.delete("/:id/members/:memberId", removeProjectMember);

export default router;
