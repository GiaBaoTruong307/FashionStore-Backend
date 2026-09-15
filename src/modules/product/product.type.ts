export type ProductResponse = {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    subCategory: string;
    sizes: string[];
    bestseller: boolean;
    date: number;
};