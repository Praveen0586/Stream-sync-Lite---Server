import { Request, Response } from "express";
import { fetchLatestVideosFromYouTube } from "../utils/youtubeutils";
import sqldb from "../configs/db"
import { Video } from "../utils/youtubeutils";

const ChannelID = process.env.YOUTUBE_CHANNEL_ID;

export const getLatestVideosHandler = async (req: Request, res: Response) => {
    try {

        const channelId = req.query.channelId as string;

        if (!channelId) {
            return res.status(400).json({ error: "channelId is required" });
        }

        const videos: Video[] = await fetchLatestVideosFromYouTube(channelId as string);
        console.log("hey Fetching by channel ID");

        for (const video of videos) {
            console.log(video.video_id);
            await sqldb.query(
                "INSERT IGNORE INTO videos (video_id, title, description, thumbnail_url, channel_id, published_at, duration_seconds) VALUES (?)",
                [[
                    video.video_id,
                    video.title,
                    video.description,
                    video.thumbnail_url,
                    video.channel_id,
                    video.published_at,
                    video.duration_seconds,
                ]]
            );

        }
        const [rows] = await sqldb.query(
            "SELECT * FROM videos ORDER BY published_at DESC LIMIT 10"
        );

        return res.json({ videos: rows });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getVideoById = async (req: Request, res: Response) => {
    try {
        const { videoid } = req.params;
        console.log("hey find vide by id ")
        if (!videoid) {
            return res.status(400).json({ error: "videoid is required" });
        }

        const query = "SELECT * FROM videos WHERE video_id = ?";
        const [rows]: any = await sqldb.query(query, [videoid]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        return res.json({ video: rows[0] });

    } catch (error) {
        console.error("Error in getVideoById:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getProgress = async (req: Request, res: Response) => {
    try {
        console.log("getting Progress");
        const { videoID, userID } = req.body;
        if (!videoID || !userID)
            return res.status(400).json({ error: "videoID and userID are required" });

        const [rows]: any = await sqldb.execute(
            "SELECT * FROM video_progress WHERE video_id = ? AND user_id = ?",
            [videoID, userID]
        );

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
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



export const updateVideoProgress = async (req: Request, res: Response) => {
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

        await sqldb.query(query, [videoId, userId, progress]);

        return res.json({
            message: "Progress updated successfully",
            data: { videoId, userId, progress }
        });

    } catch (error) {
        console.error("Error in updateVideoProgress:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
