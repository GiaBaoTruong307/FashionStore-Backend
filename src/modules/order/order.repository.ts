import prisma from "../../config/prisma";
import type { Prisma } from "@prisma/client";

export const findProductsByIds = (ids: number[]) => {
  return prisma.product.findMany({ where: { id: { in: ids } } });
};

export const createOrder = (data: Prisma.OrderCreateInput) => {
  return prisma.order.create({ data });
};

export const findByUser = (userId: number) => {
  return prisma.order.findMany({ where: { userId }, orderBy: { date: "desc" } });
};

export const findAll = () => {
  return prisma.order.findMany({ orderBy: { date: "desc" } });
};

export const findById = (id: number) => {
  return prisma.order.findUnique({ where: { id } });
};

export const updateStatus = (id: number, status: string) => {
  return prisma.order.update({ where: { id }, data: { status } });
};

export const markPaid = (id: number) => {
  return prisma.order.update({ where: { id }, data: { payment: true } });
};

export const removeOrder = (id: number) => {
  return prisma.order.delete({ where: { id } });
};