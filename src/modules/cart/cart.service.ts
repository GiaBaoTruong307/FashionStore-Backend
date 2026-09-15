import * as cartRepo from "./cart.repository";
import { AddToCartType, UpdateCartType } from "./cart.dto";

export const getCart = (userId: number) => {
    return cartRepo.getCartData(userId);
};

export const addToCart = async (userId: number, data: AddToCartType) => {
    const cartData = await cartRepo.getCartData(userId);
    const itemKey = String(data.itemId);

    cartData[itemKey] = cartData[itemKey] || {};
    cartData[itemKey][data.size] = (cartData[itemKey][data.size] || 0) + 1;

    await cartRepo.saveCartData(userId, cartData);
    return cartData;
};

export const updateCart = async (userId: number, data: UpdateCartType) => {
    const cartData = await cartRepo.getCartData(userId);
    const itemKey = String(data.itemId);

    cartData[itemKey] = cartData[itemKey] || {};

    if (data.quantity <= 0) {
        delete cartData[itemKey][data.size];
        if (Object.keys(cartData[itemKey]).length === 0) {
            delete cartData[itemKey];
        }
    } else {
        cartData[itemKey][data.size] = data.quantity;
    }

    await cartRepo.saveCartData(userId, cartData);
    return cartData;
};