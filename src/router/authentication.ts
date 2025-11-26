import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import sqldb from "../configs/db";
import { Register, Login,RefreshToken } from "../controllers/authentication_controllers";
import { authMiddleware } from "../middleware/authmiddleware";


const router = express.Router();

router.get("/test", authMiddleware, async (req: Request, res: Response) => {
    res.send("Authentication route is working");
})

router.get("/test-sql", async (req: Request, res: Response) => {
    try {
        sqldb.query("select now()",);
        res.send("Database connection successful");
        
    } catch (error) {
        res.status(500).send("Database connection failed");
    }
})

router.post("/register", Register);
router.post("/login", Login);
router.post("/refresh",RefreshToken)



export default router;