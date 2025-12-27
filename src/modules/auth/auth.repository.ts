import prisma from "../../config/prisma";
import { RegisterType } from "./auth.dto";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = (data: RegisterType) => {
  return prisma.user.create({
    data,
    // Only return specific fields
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
