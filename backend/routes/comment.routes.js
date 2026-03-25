import express from "express";
import { 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment
} from "../controllers/comment.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

// All comment routes require authentication
router.use(auth);

// Comment CRUD routes
router.get("/task/:taskId", getComments);
router.post("/task/:taskId", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
