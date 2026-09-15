import { z } from "zod";

export const AddressDTO = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipcode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
});

export const PlaceOrderDTO = z.object({
  address: AddressDTO,
});

export type PlaceOrderType = z.infer<typeof PlaceOrderDTO>;

export const UpdateOrderStatusDTO = z.object({
  orderId: z.coerce.number().int().positive(),
  status: z.enum(["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"]),
});

export type UpdateOrderStatusType = z.infer<typeof UpdateOrderStatusDTO>;

export const VerifyStripeDTO = z.object({
  orderId: z.coerce.number().int().positive(),
  success: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === "true"),
});

export type VerifyStripeType = z.infer<typeof VerifyStripeDTO>;