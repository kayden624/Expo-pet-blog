import express from "express";
import * as searchCon from "../controllers/searchCon.js";

const router = express.Router();

router.get("/blog", searchCon.searchBlog);
router.get("/blog/counts", searchCon.searchBlogCount);
router.get("/user", searchCon.searchUser);
router.get("/user/counts", searchCon.getSearchUserCount);

export default router;
