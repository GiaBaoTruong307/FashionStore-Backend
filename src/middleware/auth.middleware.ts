import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthPayload {
    id: number;
    role: "USER" | "ADMIN";
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: admin access only" });
    }
    next();
};