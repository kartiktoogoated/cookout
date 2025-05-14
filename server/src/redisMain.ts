import express, { Request, Response} from 'express';
import { redisRateLimiter } from './middlewares/rateLimiter';

const app = express();

app.post('/login', redisRateLimiter({ maxRequests:5, windowSec: 60}), (req: Request,res: Response) => {
    res.send("Login successfully");
});