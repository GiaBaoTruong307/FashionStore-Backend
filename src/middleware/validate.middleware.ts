import type { ZodType } from "zod";
import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: error.issues[0].message,
        });
      }

      return res.status(400).json({
        message: "Invalid input",
      });
    }
  };