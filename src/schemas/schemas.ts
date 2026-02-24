import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const pandaSchema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
  weight: z.number().positive(),
  habitat: z.string().min(1),
});
