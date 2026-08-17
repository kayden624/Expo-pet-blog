import express from "express";
import * as blogCon from "../controllers/blogCon.js";
import { verifyJWT } from "../middleware/requireAuth.js";

const router = express.Router();
router.post("/create", verifyJWT, blogCon.createBlog);
// home page list
router.get("/getHotBlogs", blogCon.getHotBlogs);
router.get("/blogList/followd_user", verifyJWT, blogCon.getFollowedByUserBlogs);
// user page
router.get("/blogList", blogCon.getBlogList);
router.get("/blogList/followed", blogCon.getFollowedBlogs);

// likes
router.post("/:blog_id/like", verifyJWT, blogCon.handleBlogLikes);
//follow
router.post("/:blog_id/follow", verifyJWT, blogCon.handleBlogFollow);

router.delete("/:blog_id", verifyJWT, blogCon.deleteBlog);
router.get("/:blog_id/:mode", blogCon.getBlog);

export default router;
