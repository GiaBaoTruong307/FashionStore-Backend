import * as authService from "./auth.service";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerService(req.body);
  return res.status(201).json({
    message: "User registered successfully",
    data: user,
  });
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginService(req.body);
  return res.status(200).json({
    message: "Login successful",
    data: result,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMeService(req.user!.id);
  return res.status(200).json({ data: user });
});