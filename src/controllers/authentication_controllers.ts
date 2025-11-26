import express, { Request, Response } from "express";
import sqldb from "../configs/db";
import jwt from "jsonwebtoken";
import { generateToken, generateRefreshToken } from "../utils/jwt";
import bcrypt from "bcrypt";






export const Register = async (req: Request, res: Response) => {
    console.log("User Creation Started");
    const { name, email, password } = req.body;


    if (name && email && password) {


        try {
            const hashedpassword = await bcrypt.hash(password, 10);
            const sqlquery = "INSERT INTO users (name, email, password_hash) VALUES (?)";
            await sqldb.query(sqlquery, [[name, email, hashedpassword]]);

            res.status(201).send("User registered successfully");
        } catch (error) {
            res.status(500).send("Error registering user " + error);
        }
    }

}

export const Login = async (req: Request, res: Response) => {
console.log("Login Started");
    const { email, password } = req.body;

    const userQuery = "Select * from users where email=?";
    const [rows]: any = await sqldb.query(userQuery, [email]);

    const user = rows[0];
    if (!user) return res.status(400).send("User not found");


    const ispassvalid = await bcrypt.compare(password, user.password_hash);
    if (!ispassvalid) return res.status(400).send("Invalid password");

    const token = generateToken({ id: user.id, email: user.email });
    const RefreshToken = generateRefreshToken({ id: user.id })
    console.log("User Created");
    res.status(200).json({
        "message": "Login successful",
        "user": user,
        token,
        RefreshToken
    });
console.log("Login Successful");





}

export const RefreshToken = async (req: Request, res: Response) => {

    const { refreshToken } = req.body;


    if (!refreshToken) return res.status(401).send("Refresh Token not provided");
    const refresh_Secret_key = process.env.REFRESH_SECRET as string;
    await jwt.verify(refreshToken, refresh_Secret_key, (err: any, user: any) => {
        if (err) return res.status(403).send("Invalid Refresh Token");

        const newToken = generateToken({ id: user.id, email: user.email });
        res.status(200).json({
            "message": "new Accesss Token ",
            token: newToken
        })
    })
}



