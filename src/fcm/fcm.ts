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

    // Get all tokens of a user
    async getUserTokens(userId: number) {
        const sql = "SELECT token FROM fcm_tokens WHERE user_id = ?";
        const [rows] = await db.query(sql, [userId]);
        return rows as { token: string }[];
    }

    async createNotification(userId: number, title: string, body: string, metadata?: any) {
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
    async updateJobStatus(jobId: number, status: string, error?: string) {
        const sql = `UPDATE notification_jobs SET status = ?, last_error = ?, processing_at = NOW() WHERE id = ?`;
        await db.query(sql, [status, error || null, jobId]);
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
    const [rows]: any = await db.execute(
        `SELECT 
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
        LIMIT 10`
       
    );
    return rows;
}


    async updateJob(id: number, fields: any) {
        const updates = Object.keys(fields).map(k => `${k} = ?`).join(", ");
        const values = Object.values(fields);
        values.push(id);

        await db.execute(
            `UPDATE notification_jobs SET ${updates} WHERE id = ?`,
            values
        );
    }

    async updateNotification(id: number, fields: any) {
        const updates = Object.keys(fields).map(k => `${k} = ?`).join(", ");
        const values = Object.values(fields);
        values.push(id);

        await db.execute(
            `UPDATE notifications SET ${updates} WHERE id = ?`,
            values
        );
    }


    async createNotificationJob(job: {
    notification_id: number;
    status: string;
    retries: number;
}) {
    const [result]: any = await db.execute(
        `INSERT INTO notification_jobs (notification_id, status, retries)
         VALUES (?, ?, ?)`,
        [job.notification_id, job.status, job.retries]
    );

    return result.insertId; 
}

}
