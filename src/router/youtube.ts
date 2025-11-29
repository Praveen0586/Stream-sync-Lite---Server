import express, { Request, Response } from "express";
import { getLatestVideosHandler, getProgress, getVideoById, updateVideoProgress } from "../controllers/videoscontroller";
import { authMiddleware } from "../middleware/authmiddleware";

const router = express.Router();



router.get("/test", async (req: Request, res: Response) => {
    res.send("Youtube API works")
});

router.get("/latest", authMiddleware, getLatestVideosHandler);
router.get("/:videoid", authMiddleware, getVideoById);
router.post("/progress", authMiddleware, updateVideoProgress);
router.post("/progress/get", authMiddleware, getProgress);



export default router;