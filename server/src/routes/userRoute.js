import express from "express";
import * as userCon from "../controllers/userCon.js";
import { verifyJWT } from "../middleware/requireAuth.js";

const router = express.Router();

// 创建用户
router.post("/signup", userCon.signup);
// 用户登录
router.post("/signin", userCon.login);

// 校验邮箱
router.post("/checkEmailExists", userCon.checkEmailExists);
// 更新用户信息
router.put("/:userId/profile", verifyJWT, userCon.updateProfile);
// 获取用户信息
router.get("/:userId/profile", userCon.getProfile);
// 验证密码
router.post("/password", verifyJWT, userCon.verifiedPassword);
// 更新密码
router.put("/password", verifyJWT, userCon.updatePassword);
// 删除用户
router.delete("/", verifyJWT, userCon.deleteUser);
// 关注用户
router.post("/follow", verifyJWT, userCon.followedUser);
//关注了那些人
router.get("/getFollowingUsers", userCon.getFollowingUsers);
router.get("/getFollowedUsers", userCon.getFollowedUsers);

export default router;
