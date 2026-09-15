export type OrderItemSnapshot = {
    productId: number;
    name: string;
    image: string;
    price: number;
    size: string;
    quantity: number;
};

export type OrderResponse = {
    id: number;
    items: OrderItemSnapshot[];
    amount: number;
    address: Record<string, string>;
    status: string;
    paymentMethod: string;
    payment: boolean;
    date: number;
};