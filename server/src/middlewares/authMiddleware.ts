import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface JwtUserPayload {
  userId: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader)  {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    (req as AuthenticatedRequest).user = decoded as JwtUserPayload;
    next();
  } catch (err){
    res.status(401).json({ error: "Invalid token" });
    return;
  }
}


