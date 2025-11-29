"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcm = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require("../../../serviceAccount.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
exports.fcm = firebase_admin_1.default.messaging(); // let TS infer type
