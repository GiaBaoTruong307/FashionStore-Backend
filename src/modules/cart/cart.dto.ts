import { z } from "zod";

export const AddToCartDTO = z.object({
    itemId: z.coerce.number().int().positive(),
    size: z.string().min(1, "Size is required"),
});

export type AddToCartType = z.infer<typeof AddToCartDTO>;

export const UpdateCartDTO = z.object({
    itemId: z.coerce.number().int().positive(),
    size: z.string().min(1, "Size is required"),
    quantity: z.coerce.number().int().min(0),
});

export type UpdateCartType = z.infer<typeof UpdateCartDTO>;