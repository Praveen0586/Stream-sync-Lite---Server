"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("./router/authentication"));
const youtube_1 = __importDefault(require("./router/youtube"));
const fcmrouter_1 = __importDefault(require("./router/fcmrouter"));
require("./fcm/fcmworker");
const favorites_1 = __importDefault(require("./router/favorites"));
const router = express_1.default.Router();
router.use("/auth", authentication_1.default);
router.use("/videos", youtube_1.default);
router.use("", fcmrouter_1.default);
router.use("", favorites_1.default);
exports.default = router;
