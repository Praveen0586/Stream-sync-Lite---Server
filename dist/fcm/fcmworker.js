"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../fcm/service");
const fcm_1 = require("./fcm");
const firebase_1 = require("../configs/firebase/firebase");
const repo = new fcm_1.FcmRepository();
const fcmService = new service_1.FcmService();
async function processPendingJobs() {
    const jobs = await repo.getPendingJobs();
    for (const job of jobs) {
        console.log("📌 Pending Jobs:", jobs.length);
        try {
            await repo.updateJob(job.jobId, { status: 'processing', processing_at: new Date() });
            console.log("➡️ Processing Job:", job.jobId);
            const tokens = await repo.getUserTokens(job.user_id);
            console.log("📱 Tokens found:", tokens.length);
            if (tokens.length > 0) {
                await await firebase_1.fcm.sendEachForMulticast({
                    tokens: tokens.map(t => t.token),
                    notification: {
                        title: job.title,
                        body: job.body,
                    },
                    data: job.metadata || {}
                });
            }
            await repo.updateJob(job.jobId, { status: 'sent' });
            await repo.updateNotification(job.notificationId, { sent: true });
            console.log("✅ Job sent:", job.jobId);
        }
        catch (err) {
            console.error("❌ Error processing job:", job.jobId, err.message);
            const retries = (job.retries || 0) + 1;
            await repo.updateJob(job.jobId, {
                status: retries >= 5 ? 'failed' : 'pending',
                retries,
                last_error: err.message
            });
        }
    }
}
setInterval(processPendingJobs, 5000);
