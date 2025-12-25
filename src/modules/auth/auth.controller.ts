import * as authService from "./auth.service";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerService(req.body);
    return res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginService(req.body);

    return res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
