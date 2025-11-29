"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoProgress = exports.getProgress = exports.getVideoById = exports.getLatestVideosHandler = void 0;
const youtubeutils_1 = require("../utils/youtubeutils");
const db_1 = __importDefault(require("../configs/db"));
const ChannelID = process.env.YOUTUBE_CHANNEL_ID;
const getLatestVideosHandler = async (req, res) => {
    try {
        const channelId = req.query.channelId;
        if (!channelId) {
            return res.status(400).json({ error: "channelId is required" });
        }
        const videos = await (0, youtubeutils_1.fetchLatestVideosFromYouTube)(channelId);
        console.log("hey Fetching by channel ID");
        for (const video of videos) {
            console.log(video.video_id);
            await db_1.default.query("INSERT IGNORE INTO videos (video_id, title, description, thumbnail_url, channel_id, published_at, duration_seconds) VALUES (?)", [[
                    video.video_id,
                    video.title,
                    video.description,
                    video.thumbnail_url,
                    video.channel_id,
                    video.published_at,
                    video.duration_seconds,
                ]]);
        }
        const [rows] = await db_1.default.query("SELECT * FROM videos ORDER BY published_at DESC LIMIT 10");
        return res.json({ videos: rows });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getLatestVideosHandler = getLatestVideosHandler;
const getVideoById = async (req, res) => {
    try {
        const { videoid } = req.params;
        console.log("hey find vide by id ");
        if (!videoid) {
            return res.status(400).json({ error: "videoid is required" });
        }
        const query = "SELECT * FROM videos WHERE video_id = ?";
        const [rows] = await db_1.default.query(query, [videoid]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }
        return res.json({ video: rows[0] });
    }
    catch (error) {
        console.error("Error in getVideoById:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getVideoById = getVideoById;
const getProgress = async (req, res) => {
    try {
        console.log("getting Progress");
        const { videoID, userID } = req.body;
        if (!videoID || !userID)
            return res.status(400).json({ error: "videoID and userID are required" });
        const [rows] = await db_1.default.execute("SELECT * FROM video_progress WHERE video_id = ? AND user_id = ?", [videoID, userID]);
        if (!rows || rows.length === 0) {
            return res.status(200).json({
                userID,
                videoID,
                progress: 0,
            });
        }
        const progressData = rows[0];
        return res.status(200).json({
            userID: progressData.user_id,
            videoID: progressData.video_id,
            progress: progressData.progress,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProgress = getProgress;
const updateVideoProgress = async (req, res) => {
    try {
        const { videoId, userId, progress } = req.body;
        // Validate required fields
        if (!videoId || !userId || progress === undefined) {
            return res.status(400).json({
                error: "videoId, userId, and progress are required"
            });
        }
        const query = `
            INSERT INTO video_progress (video_id, user_id, progress)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE progress = VALUES(progress)
        `;
        await db_1.default.query(query, [videoId, userId, progress]);
        return res.json({
            message: "Progress updated successfully",
            data: { videoId, userId, progress }
        });
    }
    catch (error) {
        console.error("Error in updateVideoProgress:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateVideoProgress = updateVideoProgress;
