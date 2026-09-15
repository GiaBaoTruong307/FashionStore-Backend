import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const findMany = (where: Prisma.ProductWhereInput) => {
    return prisma.product.findMany({ where, orderBy: { date: "desc" } });
};

export const findById = (id: number) => {
    return prisma.product.findUnique({ where: { id } });
};

export const create = (data: Prisma.ProductCreateInput) => {
    return prisma.product.create({ data });
};

export const update = (id: number, data: Prisma.ProductUpdateInput) => {
    return prisma.product.update({ where: { id }, data });
};

export const remove = (id: number) => {
    return prisma.product.delete({ where: { id } });
};