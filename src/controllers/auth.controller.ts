import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import Zookeeper from "../models/zookeeper";
import jwt from "jsonwebtoken";

// Register
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Zookeeper.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const zookeeper = await Zookeeper.create({ name, email, password: hashed });
    res
      .status(201)
      .json({ message: "Registered successfully", id: zookeeper._id });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const zookeeper = await Zookeeper.findOne({ email });
    if (!zookeeper) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, zookeeper.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" },
    );

    res.json({ token, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { id: string };
    const token = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
