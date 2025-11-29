"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmRepository = void 0;
const db_1 = __importDefault(require("../configs/db"));
class FcmRepository {
    async saveToken(userId, token, platform) {
        const sql = `
      INSERT INTO fcm_tokens (user_id, token, platform)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE token = VALUES(token);
    `;
        await db_1.default.query(sql, [userId, token, platform]);
    }
    async deleteToken(userId, token) {
        const sql = "DELETE FROM fcm_tokens WHERE user_id = ? AND token = ?";
        await db_1.default.query(sql, [userId, token]);
    }
    // Get all tokens of a user
    async getUserTokens(userId) {
        const sql = "SELECT token FROM fcm_tokens WHERE user_id = ?";
        const [rows] = await db_1.default.query(sql, [userId]);
        return rows;
    }
    async createNotification(userId, title, body, metadata) {
        const [result] = await db_1.default.query(`INSERT INTO notifications (user_id, title, body, metadata, sent, is_read, is_deleted)
       VALUES (?, ?, ?, ?, 0, 0, 0)`, [userId, title, body, JSON.stringify(metadata || {})]);
        const notificationId = result.insertId;
        await db_1.default.query(`INSERT INTO notification_jobs (notification_id, status, retries)
       VALUES (?, 'pending', 0)`, [notificationId]);
        return notificationId;
    }
    // Get pending jobs
    // async getPendingJobs(limit = 20) {
    //     const [rows] = await db.query(
    //         `SELECT nj.id as jobId, n.id as notificationId, n.user_id, n.title, n.body, n.metadata
    //    FROM notification_jobs nj
    //    JOIN notifications n ON n.id = nj.notification_id
    //    WHERE nj.status = 'pending'
    //    ORDER BY nj.created_at ASC
    //    LIMIT ?`,
    //         [limit]
    //     );
    //     return rows;
    // }
    // Update job status
    async updateJobStatus(jobId, status, error) {
        const sql = `UPDATE notification_jobs SET status = ?, last_error = ?, processing_at = NOW() WHERE id = ?`;
        await db_1.default.query(sql, [status, error || null, jobId]);
    }
    // async updateJob(jobId: number, data: { status?: string; retries?: number; last_error?: string; processing_at?: Date }) {
    //     const fields = [];
    //     const values: any[] = [];
    //     let idx = 1;
    //     for (const key in data) {
    //         fields.push(`${key} = $${idx}`);
    //         values.push((data as any)[key]);
    //         idx++;
    //     }
    //     values.push(jobId);
    //     const sql = `UPDATE notification_jobs SET ${fields.join(", ")} WHERE id = ?`;
    //     await db.query(sql, values);
    // }
    // async updateNotification(notificationId: number, data: { sent?: boolean }) {
    //     const fields = [];
    //     const values: any[] = [];
    //     let idx = 1;
    //     for (const key in data) {
    //         fields.push(`${key} = $${idx}`);
    //         values.push((data as any)[key]);
    //         idx++;
    //     }
    //     values.push(notificationId);
    //     const sql = `UPDATE notifications SET ${fields.join(", ")} WHERE id = ?`;
    //     await db.query(sql, values);
    // }
    //////////////////
    async getPendingJobs() {
        const [rows] = await db_1.default.execute(`SELECT 
            nj.id AS jobId,
            nj.retries,
            n.id AS notificationId,
            n.user_id,
            n.title,
            n.body,
            n.metadata
        FROM notification_jobs nj
        JOIN notifications n ON nj.notification_id = n.id
        WHERE nj.status = 'pending'
        ORDER BY nj.id
        LIMIT 10`);
        return rows;
    }
    async updateJob(id, fields) {
        const updates = Object.keys(fields).map(k => `${k} = ?`).join(", ");
        const values = Object.values(fields);
        values.push(id);
        await db_1.default.execute(`UPDATE notification_jobs SET ${updates} WHERE id = ?`, values);
    }
    async updateNotification(id, fields) {
        const updates = Object.keys(fields).map(k => `${k} = ?`).join(", ");
        const values = Object.values(fields);
        values.push(id);
        await db_1.default.execute(`UPDATE notifications SET ${updates} WHERE id = ?`, values);
    }
    async createNotificationJob(job) {
        const [result] = await db_1.default.execute(`INSERT INTO notification_jobs (notification_id, status, retries)
         VALUES (?, ?, ?)`, [job.notification_id, job.status, job.retries]);
        return result.insertId;
    }
}
exports.FcmRepository = FcmRepository;
