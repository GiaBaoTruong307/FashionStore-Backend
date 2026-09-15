import prisma from "../../config/prisma";
import { RegisterType } from "./auth.dto";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

export const createUser = (data: RegisterType) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};