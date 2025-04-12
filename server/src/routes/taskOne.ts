import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt, { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import {authMiddleware, AuthenticatedRequest } from "../middlewares/authMiddleware";

const testOneRouter = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET! || "mysecretkey";

testOneRouter.post(
  "/signup",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    res.status(200).json({ message: `User Created Successfully` });
  }
);

testOneRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({ message: "Users:", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Interval server error" });
  }
});

testOneRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Invalid Credentials" });
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  res
    .status(201)
    .json({ message: "User Created successfully", userId: user.id });
  return;
});

testOneRouter.post(
  "/signin", 
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: "1d" } // optional
      );

    res.status(200).json({ message: "User signed in", token });
    return;
  }
);

testOneRouter.get(
  '/me',
  authMiddleware, // ensure authMiddleware attaches req.user correctly
  async (req: Request, res: Response): Promise<void> => {
    // Cast here so TypeScript knows about the custom "user" property
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(400).json({ message: 'Invalid Request' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  }
);

export default testOneRouter;
