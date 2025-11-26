import { Request, Response } from "express";
import { FcmService } from "../fcm/service";

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
}
