import { Request, Response } from "express";
import * as cartService from "./cart.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
    const cartData = await cartService.getCart(req.user!.id);
    return res.status(200).json({ data: cartData });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const cartData = await cartService.addToCart(req.user!.id, req.body);
    return res.status(200).json({ message: "Added to cart", data: cartData });
});

export const updateCart = asyncHandler(async (req: Request, res: Response) => {
    const cartData = await cartService.updateCart(req.user!.id, req.body);
    return res.status(200).json({ message: "Cart updated", data: cartData });
});