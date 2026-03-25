import express from "express";
const router = express.Router();
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/profile - Get user profile (protected)
router.get("/profile", authenticateToken, getProfile);

export default router;
