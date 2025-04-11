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

export default testRouter;


