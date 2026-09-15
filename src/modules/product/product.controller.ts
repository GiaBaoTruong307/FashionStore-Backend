import { Request, Response } from "express";
import * as productService from "./product.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
    const { category, subCategory, search } = req.query as {
        category?: string;
        subCategory?: string;
        search?: string;
    };

    const products = await productService.listProducts({ category, subCategory, search });
    return res.status(200).json({ data: products });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = await productService.getProduct(id);
    return res.status(200).json({ data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) || [];
    const product = await productService.createProduct(req.body, files);
    return res.status(201).json({ message: "Product created successfully", data: product });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const files = (req.files as Express.Multer.File[]) || [];
    const product = await productService.updateProduct(id, req.body, files);
    return res.status(200).json({ message: "Product updated successfully", data: product });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await productService.deleteProduct(id);
    return res.status(200).json({ message: "Product deleted successfully" });
});