// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { TokenManager } from "../utils/tokenManager";
import { login } from "../services/authService";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        if (TokenManager.isExpired()) {
            await login(); // renova token
        }

        const token = TokenManager.getToken();

        if (!token) {
            return res.status(401).json({ error: "Token não disponível" });
        }

        console.log("Token "+ token);
        

        req.headers["Authorization"] = `Bearer ${token}`;

        next();
    } catch (e: any) {
        return res.status(401).json({ error: e.message });
    }
}
