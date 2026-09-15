import * as productRepo from "./product.repository";
import { CreateProductType, UpdateProductType } from "./product.dto";
import { ProductResponse } from "./product.type";
import { AppError } from "../../middleware/error.middleware";
import { v2 as cloudinary } from "cloudinary";
import { Prisma, type Product } from "@prisma/client";

const serialize = (product: Product): ProductResponse => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: Number(product.price),
  images: product.images as string[],
  category: product.category,
  subCategory: product.subCategory,
  sizes: product.sizes as string[],
  bestseller: product.bestseller,
  date: Number(product.date),
});

const parseSizes = (sizes: string | string[]): string[] => {
  if (Array.isArray(sizes)) return sizes;
  try {
    const parsed = JSON.parse(sizes);
    return Array.isArray(parsed) ? parsed : [sizes];
  } catch {
    return [sizes];
  }
};

const uploadImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const uploads = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      })
  );

  return Promise.all(uploads);
};

const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

const deleteImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(async (url) => {
      const publicId = extractPublicId(url);
      if (!publicId) return;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // Bỏ qua lỗi xoá ảnh — không chặn thao tác chính của người dùng
      }
    })
  );
};

export const listProducts = async (query: {
  category?: string;
  subCategory?: string;
  search?: string;
}) => {
  const where: Prisma.ProductWhereInput = {};
  if (query.category) where.category = query.category;
  if (query.subCategory) where.subCategory = query.subCategory;
  if (query.search) where.name = { contains: query.search };

  const products = await productRepo.findMany(where);
  return products.map(serialize);
};

export const getProduct = async (id: number) => {
  const product = await productRepo.findById(id);
  if (!product) throw new AppError("Product not found", 404);
  return serialize(product);
};

export const createProduct = async (
  data: CreateProductType,
  files: Express.Multer.File[]
) => {
  if (!files || files.length === 0) {
    throw new AppError("At least one product image is required", 400);
  }

  const images = await uploadImages(files);

  const product = await productRepo.create({
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    subCategory: data.subCategory,
    sizes: parseSizes(data.sizes),
    bestseller: data.bestseller ?? false,
    images,
    date: BigInt(Date.now()),
  });

  return serialize(product);
};

export const updateProduct = async (
  id: number,
  data: UpdateProductType,
  files?: Express.Multer.File[]
) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new AppError("Product not found", 404);

  const images = files && files.length > 0 ? await uploadImages(files) : undefined;

  const product = await productRepo.update(id, {
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.price !== undefined && { price: data.price }),
    ...(data.category && { category: data.category }),
    ...(data.subCategory && { subCategory: data.subCategory }),
    ...(data.sizes && { sizes: parseSizes(data.sizes) }),
    ...(data.bestseller !== undefined && { bestseller: data.bestseller }),
    ...(images && { images }),
  });

  if (images) {
    await deleteImages(existing.images as string[]);
  }

  return serialize(product);
};

export const deleteProduct = async (id: number) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new AppError("Product not found", 404);

  await productRepo.remove(id);
  await deleteImages(existing.images as string[]);
};