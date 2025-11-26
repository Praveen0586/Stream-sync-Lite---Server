import express, { Request, Response } from "express";
import {  getLatestVideosHandler, getVideoById, updateVideoProgress } from "../controllers/videoscontroller";

const router = express.Router();



router.get("/test", async (req: Request, res: Response) => {
    res.send("Youtube API works")
});

router.get("/latest", getLatestVideosHandler);
router.get("/:videoid",getVideoById);
router.post("/progress", updateVideoProgress);


export default router;