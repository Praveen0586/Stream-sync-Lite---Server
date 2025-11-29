"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = exports.Login = exports.Register = void 0;
const db_1 = __importDefault(require("../configs/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Register = async (req, res) => {
    console.log("User Creation Started");
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const hashedpassword = await bcrypt_1.default.hash(password, 10);
            const sqlquery = "INSERT INTO users (name, email, password_hash) VALUES (?)";
            await db_1.default.query(sqlquery, [[name, email, hashedpassword]]);
            res.status(201).send("User registered successfully");
        }
        catch (error) {
            res.status(500).send("Error registering user " + error);
        }
    }
};
exports.Register = Register;
const Login = async (req, res) => {
    console.log("Login Started");
    const { email, password } = req.body;
    const userQuery = "Select * from users where email=?";
    const [rows] = await db_1.default.query(userQuery, [email]);
    const user = rows[0];
    if (!user)
        return res.status(400).send("User not found");
    const ispassvalid = await bcrypt_1.default.compare(password, user.password_hash);
    if (!ispassvalid)
        return res.status(400).send("Invalid password");
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
    const RefreshToken = (0, jwt_1.generateRefreshToken)({ id: user.id });
    console.log("User Created");
    res.status(200).json({
        "message": "Login successful",
        "user": user,
        token,
        RefreshToken
    });
    console.log("Login Successful");
};
exports.Login = Login;
const RefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
        return res.status(401).send("Refresh Token not provided");
    const refresh_Secret_key = process.env.REFRESH_SECRET;
    await jsonwebtoken_1.default.verify(refreshToken, refresh_Secret_key, (err, user) => {
        if (err)
            return res.status(403).send("Invalid Refresh Token");
        const newToken = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        res.status(200).json({
            "message": "new Accesss Token ",
            token: newToken
        });
    });
};
exports.RefreshToken = RefreshToken;
