import { JwtPayload } from "jsonwebtoken";

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}

// express.d.ts
import { JwtUserPayload } from "./src/middlewares/authMiddleware"; // adjust the path

declare global {
  namespace Express {
    export interface Request {
      user?: JwtUserPayload;
    }
  }
}
