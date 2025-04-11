import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { hash } from 'bcryptjs';
import { authMiddleware } from "middlewares/authMiddleware";

const testOneRouter = Router();
const prisma = new PrismaClient();

testOneRouter.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'invalid credentials' })
        return;
    }

    const existingUser = await prisma.user.findUnique({
        where: {email},
    })
    if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data:{
            email,
            password: hashedPassword,
            name,
        }
    });
    res.status(200).json({ message: `User Created Successfully` });
});

testOneRouter.get('/', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json({ message: 'Users:', users})
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Interval server error' })
    }
});

export default testOneRouter;