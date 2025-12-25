import prisma from "../../config/prisma";

export const getUsers = async () => {
  return prisma.user.findMany();
};

export const createUser = async (email: string, name: string) => {
  return prisma.user.create({
    data: { email, name },
  });
};
