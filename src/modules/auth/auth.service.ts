import * as authRepo from "./auth.repository";
import { RegisterResponse, LoginResponse } from "./auth.type";
import { LoginType, RegisterType } from "./auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "3d",
  });
};

// Registration service
export const registerService = async (
  data: RegisterType
): Promise<RegisterResponse> => {
  const exists = await authRepo.findUserByEmail(data.email);

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepo.createUser({
    ...data,
    password: hashedPassword,
  });

  return {
    ...user,
  };
};

// Login service
export const loginService = async (data: LoginType): Promise<LoginResponse> => {
  const user = await authRepo.findUserByEmail(data.email);

  if (!user) {
    throw new Error("User does not exist");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = createToken(user.id);

  return {
    id: user.id,
    token,
  };
};

//  const token = createToken(user.id);
