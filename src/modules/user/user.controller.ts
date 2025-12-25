import { Request, Response } from "express";
import * as userService from "./user.service";

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const user = await userService.createUser(email, name);
  res.status(201).json(user);
};
