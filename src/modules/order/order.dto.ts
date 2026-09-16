import { z } from "zod";

export const AddressDTO = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  email: z.email("Email không hợp lệ"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ đường"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  state: z.string().min(1, "Vui lòng nhập tỉnh/bang"),
  zipcode: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
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