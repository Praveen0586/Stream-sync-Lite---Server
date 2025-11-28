import { Request, Response } from "express";
import { FcmService } from "../fcm/service";
import db from "../configs/db";
const service = new FcmService();

export class FcmController {

  async register(req: Request, res: Response) {
    const { id } = req.params;
    const { token, platform } = req.body;

    try {
      await service.registerToken(Number(id), token, platform);
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Failed to save FCM token" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { token } = req.body;

    try {
      await service.deleteToken(Number(id), token);
      return res.json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: "Delete failed" });
    }
  }

  async sendTest(req: Request, res: Response) {
    const { userId, title, body } = req.body;

    try {
      await service.sendToUser(Number(userId), title, body);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Push failed" });
    }
  }


  

  async getNotifications(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const limit = Number(req.query.limit) || 50;
      const since = req.query.since ? new Date(String(req.query.since)) : null;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      let query = `
      SELECT id, user_id, title, body, metadata, received_at, is_read, is_deleted
      FROM notifications
      WHERE user_id = ? AND is_deleted = 0
    `;
      const params: any[] = [userId];

      // Filter: only notifications newer than given timestamp
      if (since) {
        query += " AND received_at > ?";
        params.push(since);
      }

      query += `
      ORDER BY received_at DESC
      LIMIT ?
    `;
      params.push(limit);

      const [rows] = await db.query(query, params);

      return res.json({
        success: true,
        count: (rows as any[]).length,
        notifications: rows,
      });

    } catch (err) {
      console.error("Get Notifications Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }async getNotificationCount(req: Request, res: Response) {
  try {
    const userId = Number(req.query.userId);

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const query = `
      SELECT COUNT(*) AS count
      FROM notifications
      WHERE user_id = ? AND is_deleted = 0
    `;
    const params = [userId];

    const [rows] = await db.query(query, params);

    return res.json({
      success: true,
      count: (rows as any[])[0].count || 0,
    });

  } catch (err) {
    console.error("Get Notification Count Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

  async adminside(req: Request, res: Response) {
    try {
      const { userId, title, body, metadata } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const [result]: any = await db.query(
        `INSERT INTO notifications (user_id, title, body, metadata, sent, is_read, is_deleted)
         VALUES (?, ?, ?, ?, 0, 0, 0)`,
        [userId, title, body, JSON.stringify(metadata || {})]
      );

      const notificationId = result.insertId;

      await db.query(
        `INSERT INTO notification_jobs (notification_id, status, retries)
         VALUES (?, 'pending', 0)`,
        [notificationId]
      );

      return res.json({
        success: true,
        message: "Notification created & job queued",
        notificationId,
      });

    } catch (err) {
      console.error("ADMIN Notification Error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }

  async deleteNotification(req: Request, res: Response) {
  try {
    const notificationId = Number(req.params.id);
    const userId = Number(req.query.userId);

    if (!userId) return res.status(400).json({ success: false, error: "userId is required" });

    const [result]: any = await db.query(
      `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    return res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete Notification Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

async markAsRead(req: Request, res: Response) {
  try {
    const { userId, notificationIds } = req.body;

    if (!userId || !notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({ success: false, error: "userId and notificationIds are required" });
    }

    const [result]: any = await db.query(
      `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND id IN (?)`,
      [userId, notificationIds]
    );

    return res.json({ success: true, message: "Notifications marked as read" });
  } catch (err) {
    console.error("Mark Notifications Read Error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
}
}
