import * as authRepo from "./auth.repository";
import { RegisterResponse, LoginResponse } from "./auth.type";
import { LoginType, RegisterType } from "./auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../middleware/error.middleware";

const createToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

export const registerService = async (
  data: RegisterType
): Promise<RegisterResponse> => {
  const exists = await authRepo.findUserByEmail(data.email);

  if (exists) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepo.createUser({
    ...data,
    password: hashedPassword,
  });

  return { ...user };
};

export const loginService = async (data: LoginType): Promise<LoginResponse> => {
  const user = await authRepo.findUserByEmail(data.email);

  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = createToken(user.id, user.role);

  return {
    id: user.id,
    token,
  };
};

export const getMeService = async (userId: number): Promise<RegisterResponse> => {
  const user = await authRepo.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};