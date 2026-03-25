import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/authMiddleware-fixed.js';
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController-prisma.js';
import { validateCreateProject, validateUpdateProject } from '../validators/projectValidator-prisma.js';

/**
 * Project Routes - Prisma Version
 * All routes are protected and require JWT authentication
 * Base path: /api/projects
 */

// POST /api/projects - Create a new project
router.post('/', authenticateToken, validateCreateProject, createProject);

// GET /api/projects - Get all projects for the logged-in user
router.get('/', authenticateToken, getUserProjects);

// GET /api/projects/:id - Get a specific project
router.get('/:id', authenticateToken, getProjectById);

// PUT /api/projects/:id - Update a project
router.put('/:id', authenticateToken, validateUpdateProject, updateProject);

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', authenticateToken, deleteProject);

export default router;
