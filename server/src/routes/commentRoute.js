import express from "express";
import * as commentCon from "../controllers/commentCon.js";
import { verifyJWT } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/create", verifyJWT, commentCon.createComment);
router.get("/commentList/:blog_id/:page/:limit", commentCon.getCommentByBlog);
router.get("/:comment_id", commentCon.getCommentById);
router.delete("/:comment_id", verifyJWT, commentCon.deleteComment);

export default router;
