import express from "express";

import auth from "./router/authentication";
import youtube from "./router/youtube";
import fcmRoutes from "./router/fcmrouter";
import "./fcm/fcmworker";
import favorites from "./router/favorites";
const router = express.Router();

router.use("/auth", auth);
router.use("/videos", youtube);
router.use("", fcmRoutes);
router.use("", favorites);
export default router;



