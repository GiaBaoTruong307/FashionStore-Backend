import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import productRoute from "../modules/product/product.route";
import cartRoute from "../modules/cart/cart.route";
import orderRoute from "../modules/order/order.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/cart", cartRoute);
router.use("/orders", orderRoute);

export default router;