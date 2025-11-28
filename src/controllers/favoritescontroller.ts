
import { Request, Response } from "express";
import db from "../configs/db";


export const addFavorite = async (req: Request, res: Response) => {
  console.log("add to Favoriues")
  try {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
      return res.status(400).json({ error: "user_id and video_id required" });
    }

    const [result]: any = await db.query(
      `INSERT INTO favorites (user_id, video_id, synced)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE synced = 1`,
      [user_id, video_id]
    );

    return res.json({ message: "Added to favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
export const removeFavorite = async (req: Request, res: Response) => {
  try {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
      return res.status(400).json({ error: "user_id and video_id required" });
    }

    const [result]: any = await db.query(
      `DELETE FROM favorites WHERE user_id = ? AND video_id = ?`,
      [user_id, video_id]
    );

    return res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
export const getFavorites = async (req: Request, res: Response) => {
  console.log("Getting Fav IDs")
  try {
    const user_id = req.params.user_id;
    const [rows]: any = await db.query(
      `SELECT video_id, created_at, synced 
       FROM favorites 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user_id]
    );

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }




};

export const getFavoriteVideos = async (req: Request, res: Response) => {
  try {
    const { video_ids } = req.body;

    if (!video_ids || !Array.isArray(video_ids) || video_ids.length === 0) {
      return res.status(400).json({ error: "video_ids array required" });
    }

    const placeholders = video_ids.map(() => '?').join(',');

    const [rows]: any = await db.query(
      `
    SELECT 
      video_id,
      title,
      description,
      thumbnail_url,
      duration_seconds,
      created_at
    FROM videos
    WHERE video_id IN (${placeholders})
  `,
      video_ids
    );

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};