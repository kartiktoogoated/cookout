import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const testRouter = Router();
const prisma = new PrismaClient();

testRouter.get('/', (req: Request, res: Response)=> {
    res.json({ message: 'Hello World!' })
});

testRouter.get('/users', async (req: Request, res: Response): Promise<void> => {
    const email = req.query.email as string
    
    const users = await prisma.user.findUnique({
        where: {email },
    });
    res.json(users);
})

/// create a function to create a user with current schema prisma
testRouter.post('/users', async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });

    res.json(user);
});

export default testRouter;


