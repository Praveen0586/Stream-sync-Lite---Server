import { Router } from "express";
import { FcmController } from "../controllers/fcmControllers";
import { authMiddleware } from "../middleware/authmiddleware";

const router = Router();
const c = new FcmController();

router.post("/users/:id/fcmToken", authMiddleware, c.register);
router.delete("/users/:id/fcmToken", authMiddleware, c.delete);
router.post("/notifications/send-test", authMiddleware, c.sendTest);
router.post("/notifications", authMiddleware, c.adminside);
router.get("/notifications", authMiddleware, c.getNotifications);
router.get("/notifications/count", authMiddleware, c.getNotificationCount);
router.delete("/notifications/:id", authMiddleware, c.deleteNotification);
router.post("/notifications/mark-read", authMiddleware, c.markAsRead);

export default router;
