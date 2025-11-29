"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", app_1.default);
app.get("/", (req, res) => {
    res.send("🚀 TypeScript Node Server is running!");
});
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
