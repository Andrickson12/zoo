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

    // generate access toekn (15 min)
    const token = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    // generate access token (7  days)
    const refreshToken = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" },
    );

    // save refresh tpken to db
    zookeeper.refreshToken = refreshToken;
    await zookeeper.save();
    console.log(
      "Login successful - refresh token saved to DB for:",
      zookeeper.email,
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

    // verify the token signature
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { id: string };
    console.log("Refresh token signature valid for zookeeper id:", decoded.id);

    // check if this exact token exists in DB
    const zookeeper = await Zookeeper.findOne({
      _id: decoded.id,
      refreshToken,
    });
    if (!zookeeper) {
      console.log(
        "Refresh token not found in DB - possibly stolen or already used",
      );
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    // generate new tokens
    const newToken = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      { id: zookeeper._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" },
    );

    // replace old refresh token with new one in DB (rotation)
    zookeeper.refreshToken = newRefreshToken;
    await zookeeper.save();
    console.log(
      "Rotation complete - old token deleted, new token saved for:",
      zookeeper.email,
    );

    res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};
