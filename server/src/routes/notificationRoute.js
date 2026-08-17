import express from "express";
import * as notificationCon from "../controllers/notificationCon.js";
import { verifyJWT } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/", verifyJWT, notificationCon.createNotification);
router.get("/list/:user_id", verifyJWT, notificationCon.getNotificationList);
router.delete("/", verifyJWT, notificationCon.deleteNotification);
router.get(
  `/notice-comment/:page/:limit/:type`,
  verifyJWT,
  notificationCon.getNotice
);

export default router;
