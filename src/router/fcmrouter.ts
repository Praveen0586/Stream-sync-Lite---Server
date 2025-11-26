import { Router } from "express";
import { FcmController } from "../controllers/fcmControllers";

const router = Router();
const c = new FcmController();

router.post("/users/:id/fcmToken", c.register);
router.delete("/users/:id/fcmToken", c.delete);
router.post("/notifications/send-test", c.sendTest);

export default router;
