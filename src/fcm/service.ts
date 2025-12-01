import { FcmRepository } from "./fcm";
import { fcm } from "../configs/firebase/firebase";

export class FcmService {
    repo = new FcmRepository();

    // async registerToken(userId: number, token: string, platform: string) {
    //     await this.repo.saveToken(userId, token, platform);
    //     console.log(`Saving token for user ${userId}: ${token} (${platform})`);

    // }
    async registerToken(userId: number, token: string, platform: string) {
    try {
        console.log(`🔄 Attempting to save token for user ${userId}...`);
        await this.repo.saveToken(userId, token, platform);
        console.log(`✅ Token saved successfully for user ${userId}: ${token.substring(0, 30)}... (${platform})`);
    } catch (error: any) {
        console.error(`❌ Error saving token for user ${userId}:`, error.message);
        console.error("Full error:", error);
        throw error;
    }
}

    async deleteToken(userId: number, token: string) {
        await this.repo.deleteToken(userId, token);
    }
async sendToUser(userId: number, title: string, body: string, metadata?: any) {
    // 1️⃣ Create notification and get its ID
    const notificationId: number = await this.repo.createNotification(userId, title, body, metadata);

    // 2️⃣ Enqueue job
    await this.repo.createNotificationJob({
        notification_id: notificationId,
        status: 'pending',
        retries: 0
    });

    // 3️⃣ Worker (separate cron/interval) will pick this job and send via FCM
}

}
