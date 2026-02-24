import { NextFunction, Request, Response } from "express";
import Panda from "../models/panda";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    const pandas = await Panda.find(filter).skip(skip).limit(limit);
    const total = await Panda.countDocuments(filter);

    res.json({ total, page, limit, pandas });
  } catch (err) {
    next(err);
  }
};

// Get one
export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const panda = await Panda.findById(req.params.id);
    if (!panda) {
      res.status(404).json({ message: "Panda not found" });
      return;
    }
    res.json(panda);
  } catch (err) {
    next(err);
  }
};

// Create
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, age, weight, habitat } = req.body;
    const panda = await Panda.create({
      name,
      age,
      weight,
      habitat,
      addedBy: (req as any).zookeeperId,
    });
    res.status(201).json(panda);
  } catch (err) {
    next(err);
  }
};

// Update
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const panda = await Panda.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!panda) {
      res.status(404).json({ message: "Panda not found" });
      return;
    }
    res.json(panda);
  } catch (err) {
    next(err);
  }
};

// Remove
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const panda = await Panda.findByIdAndDelete(req.params.id);
    if (!panda) {
      res.status(404).json({ message: "Panda not found" });
      return;
    }
    res.json({ message: "Panda deleted" });
  } catch (err) {
    next(err);
  }
};

// Get my pandas
export const getMyPandas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pandas = await Panda.find({ addedBy: (req as any).zookeeperId });
    res.json(pandas);
  } catch (err) {
    next(err);
  }
};
