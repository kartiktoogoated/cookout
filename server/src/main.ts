import express, { Router, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { SignupSchema, SigninSchema } from "routes/types/user";
import bcrypt, { hash } from 'bcryptjs';
import cors from 'cors';

export const router = Router();

router.use(cors());
router.use(express.json());

router.post(
    "/signup",
    async (req: Request, res: Response): Promise<void> => {
        const parsed = SignupSchema.safeParse(req.body);
        if(!parsed.success) {
            console.log(`Signup validation failed: ${JSON.stringify(parsed.error.flatten())}`);
            res.status(400).json({ message: "Validation failed" });
            return;
        }

        try {
            const hashed = await hash(parsed.data.password, 10);
            const user = await client.user.create({
                data: {
                    username: parsed.data.username,
                    password: hashed,
                    role: "User",
                },
            });
            console.log(`New user created: id=${user.id} username=${parsed.data.username}`);
            res.json({ userId: user.id });
        } catch (err: any) {
            err(`Signup error for username=${parsed.data.username}: ${err.message}`);
            res.status(400).json({ message: "User already exist" });
        }
    }
);