import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export const generateToken = (payload: object) => {
    return jwt.sign(payload, SECRET, { expiresIn: "3h" })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET);
}

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}