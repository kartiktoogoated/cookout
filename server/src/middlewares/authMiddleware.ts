// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/logger";  
import { JWT_SECRET } from "../config"
// Define a safe extension of Request
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if the Authorization header exists
    if (!authHeader) {
      logger.warn("Authentication failed: No Authorization header provided");
      return res.status(401).json({ error: "No token provided" });
    }

    // 2. Validate Authorization format: should be 'Bearer <token>'
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      logger.warn("Authentication failed: Malformed Authorization header");
      return res.status(401).json({ error: "Invalid authorization format" });
    }

    const token = parts[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Validate token contents
    if (typeof decoded !== "object" || !decoded) {
      logger.warn("Authentication failed: Invalid token payload structure");
      return res.status(401).json({ error: "Invalid token" });
    }

    // 5. Attach user to request
    (req as AuthenticatedRequest).user = decoded;

    logger.info(`Authentication success for user ${JSON.stringify(decoded)}`);

    next(); // user is authenticated → continue to next handler

  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    
    // Token errors can be handled more specifically if needed
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
