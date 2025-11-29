"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../configs/db"));
const authentication_controllers_1 = require("../controllers/authentication_controllers");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get("/test", authmiddleware_1.authMiddleware, async (req, res) => {
    res.send("Authentication route is working");
});
router.get("/test-sql", async (req, res) => {
    try {
        db_1.default.query("select now()");
        res.send("Database connection successful");
    }
    catch (error) {
        res.status(500).send("Database connection failed");
    }
});
router.post("/register", authentication_controllers_1.Register);
router.post("/login", authentication_controllers_1.Login);
router.post("/refresh", authentication_controllers_1.RefreshToken);
exports.default = router;
