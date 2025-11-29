"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const videoscontroller_1 = require("../controllers/videoscontroller");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get("/test", async (req, res) => {
    res.send("Youtube API works");
});
router.get("/latest", authmiddleware_1.authMiddleware, videoscontroller_1.getLatestVideosHandler);
router.get("/:videoid", authmiddleware_1.authMiddleware, videoscontroller_1.getVideoById);
router.post("/progress", authmiddleware_1.authMiddleware, videoscontroller_1.updateVideoProgress);
router.post("/progress/get", authmiddleware_1.authMiddleware, videoscontroller_1.getProgress);
exports.default = router;
