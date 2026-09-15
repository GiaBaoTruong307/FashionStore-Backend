import Stripe from "stripe";
import * as orderRepo from "./order.repository";
import * as cartRepo from "../cart/cart.repository";
import { PlaceOrderType, UpdateOrderStatusType } from "./order.dto";
import { OrderItemSnapshot, OrderResponse } from "./order.type";
import { AppError } from "../../middleware/error.middleware";
import { env } from "../../config/env";
import type { Order } from "@prisma/client";

const serialize = (order: Order): OrderResponse => ({
  id: order.id,
  items: order.items as OrderItemSnapshot[],
  amount: Number(order.amount),
  address: order.address as Record<string, string>,
  status: order.status,
  paymentMethod: order.paymentMethod,
  payment: order.payment,
  date: Number(order.date),
});

const getStripeClient = () => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new AppError("Stripe chưa được cấu hình trên server", 500);
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
};

const buildOrderItems = async (userId: number) => {
  const cartData = await cartRepo.getCartData(userId);
  const itemIds = Object.keys(cartData).map(Number);

  if (itemIds.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const products = await orderRepo.findProductsByIds(itemIds);
  const items: OrderItemSnapshot[] = [];
  let amount = 0;

  for (const productId of itemIds) {
    const product = products.find((p) => p.id === productId);
    if (!product) continue;

    for (const size in cartData[productId]) {
      const quantity = cartData[productId][size];
      if (quantity <= 0) continue;

      items.push({
        productId,
        name: product.name,
        image: (product.images as string[])[0] ?? "",
        price: Number(product.price),
        size,
        quantity,
      });
      amount += Number(product.price) * quantity;
    }
  }

  if (items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  return { items, amount };
};

export const placeOrderCOD = async (userId: number, data: PlaceOrderType) => {
  const { items, amount } = await buildOrderItems(userId);

  const order = await orderRepo.createOrder({
    user: { connect: { id: userId } },
    items,
    amount,
    address: data.address,
    paymentMethod: "COD",
    payment: false,
    date: BigInt(Date.now()),
  });

  await cartRepo.saveCartData(userId, {});

  return serialize(order);
};

export const placeOrderStripe = async (
  userId: number,
  data: PlaceOrderType,
  originUrl: string
) => {
  const stripe = getStripeClient();
  const { items, amount } = await buildOrderItems(userId);

  const order = await orderRepo.createOrder({
    user: { connect: { id: userId } },
    items,
    amount,
    address: data.address,
    paymentMethod: "Stripe",
    payment: false,
    date: BigInt(Date.now()),
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  line_items.push({
    price_data: {
      currency: "usd",
      product_data: { name: "Delivery Charges" },
      unit_amount: 1000,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${originUrl}/verify-stripe?success=true&orderId=${order.id}`,
    cancel_url: `${originUrl}/verify-stripe?success=false&orderId=${order.id}`,
  });

  return { sessionUrl: session.url as string };
};

export const verifyStripeOrder = async (userId: number, orderId: number, success: boolean) => {
  const order = await orderRepo.findById(orderId);

  if (!order || order.userId !== userId) {
    throw new AppError("Order not found", 404);
  }

  if (success) {
    await orderRepo.markPaid(orderId);
    await cartRepo.saveCartData(userId, {});
    return { verified: true };
  }

  await orderRepo.removeOrder(orderId);
  return { verified: false };
};

export const getUserOrders = async (userId: number) => {
  const orders = await orderRepo.findByUser(userId);
  return orders.map(serialize);
};

export const getAllOrders = async () => {
  const orders = await orderRepo.findAll();
  return orders.map(serialize);
};

export const updateOrderStatus = async (data: UpdateOrderStatusType) => {
  const order = await orderRepo.findById(data.orderId);
  if (!order) throw new AppError("Order not found", 404);

  const updated = await orderRepo.updateStatus(data.orderId, data.status);
  return serialize(updated);
};