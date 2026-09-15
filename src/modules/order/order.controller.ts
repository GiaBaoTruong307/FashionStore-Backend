import { Request, Response } from "express";
import * as orderService from "./order.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { env } from "../../config/env";

export const placeOrderCOD = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.placeOrderCOD(req.user!.id, req.body);
  return res.status(201).json({ message: "Order placed successfully", data: order });
});

export const placeOrderStripe = asyncHandler(async (req: Request, res: Response) => {
  const origin = req.headers.origin || env.CLIENT_URL;
  const result = await orderService.placeOrderStripe(req.user!.id, req.body, origin);
  return res.status(201).json({ data: result });
});

export const verifyStripe = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, success } = req.body;
  const result = await orderService.verifyStripeOrder(req.user!.id, orderId, success);
  return res.status(200).json({ data: result });
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getUserOrders(req.user!.id);
  return res.status(200).json({ data: orders });
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  return res.status(200).json({ data: orders });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.body);
  return res.status(200).json({ message: "Order status updated", data: order });
});