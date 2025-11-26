import { FcmRepository } from "./fcm";
import { fcm } from "../configs/firebase/firebase";

export class FcmService {
    repo = new FcmRepository();

    async registerToken(userId: number, token: string, platform: string) {
        await this.repo.saveToken(userId, token, platform);
    }

    async deleteToken(userId: number, token: string) {
        await this.repo.deleteToken(userId, token);
    }

    async sendToUser(userId: number, title: string, body: string) {
        const tokens = await this.repo.getUserTokens(userId);
        if (tokens.length === 0) return;

        const message = {
            tokens: tokens.map((t) => t.token),
            notification: { title, body },
        };

        await fcm.sendEachForMulticast(message);
    }
}
