"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmService = void 0;
const fcm_1 = require("./fcm");
class FcmService {
    constructor() {
        this.repo = new fcm_1.FcmRepository();
    }
    async registerToken(userId, token, platform) {
        await this.repo.saveToken(userId, token, platform);
    }
    async deleteToken(userId, token) {
        await this.repo.deleteToken(userId, token);
    }
    async sendToUser(userId, title, body, metadata) {
        // 1️⃣ Create notification and get its ID
        const notificationId = await this.repo.createNotification(userId, title, body, metadata);
        // 2️⃣ Enqueue job
        await this.repo.createNotificationJob({
            notification_id: notificationId,
            status: 'pending',
            retries: 0
        });
        // 3️⃣ Worker (separate cron/interval) will pick this job and send via FCM
    }
}
exports.FcmService = FcmService;
