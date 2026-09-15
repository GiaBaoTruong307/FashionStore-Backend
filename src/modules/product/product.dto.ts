import { z } from "zod";

export const CreateProductDTO = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "SubCategory is required"),
    sizes: z.union([z.string(), z.array(z.string())]),
    bestseller: z
        .union([z.boolean(), z.string()])
        .optional()
        .transform((v) => v === true || v === "true"),
});

export type CreateProductType = z.infer<typeof CreateProductDTO>;

export const UpdateProductDTO = CreateProductDTO.partial();
export type UpdateProductType = z.infer<typeof UpdateProductDTO>;