import prisma from "../../config/prisma";
import type { CartData } from "./cart.type";

export const getCartData = async (userId: number): Promise<CartData> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { cartData: true },
    });

    return (user?.cartData as CartData) ?? {};
};

export const saveCartData = (userId: number, cartData: CartData) => {
    return prisma.user.update({
        where: { id: userId },
        data: { cartData },
    });
};