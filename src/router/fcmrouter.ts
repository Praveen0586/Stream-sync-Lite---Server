import { Router } from "express";
import { FcmController } from "../controllers/fcmControllers";

const router = Router();
const c = new FcmController();

router.post("/users/:id/fcmToken", c.register);
router.delete("/users/:id/fcmToken", c.delete);
router.post("/notifications/send-test", c.sendTest);
router.post("/notifications", c.adminside);
router.get("/notifications", c.getNotifications);
router.get("/notifications/count", c.getNotificationCount);
router.delete("/notifications/:id", c.deleteNotification);
router.post("/notifications/mark-read", c.markAsRead);

export default router;
