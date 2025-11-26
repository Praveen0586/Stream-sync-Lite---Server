import db from "../configs/db";

export class FcmRepository {

    async saveToken(userId: number, token: string, platform: string) {
        const sql = `
      INSERT INTO fcm_tokens (user_id, token, platform)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE token = VALUES(token);
    `;
        await db.query(sql, [userId, token, platform]);
    }

    async deleteToken(userId: number, token: string) {
        const sql = "DELETE FROM fcm_tokens WHERE user_id = ? AND token = ?";
        await db.query(sql, [userId, token]);
    }

    async getUserTokens(userId: number) {
        const sql = "SELECT token FROM fcm_tokens WHERE user_id = ?";
        const [rows] = await db.query(sql, [userId]);
        return rows as { token: string }[];
    }
}
