import { Router } from "express";
import * as orderController from "./order.controller";
import { validate } from "../../middleware/validate.middleware";
import { PlaceOrderDTO, UpdateOrderStatusDTO, VerifyStripeDTO } from "./order.dto";
import { protect, adminOnly } from "../../middleware/auth.middleware";

const router = Router();

router.post("/place", protect, validate(PlaceOrderDTO), orderController.placeOrderCOD);
router.post("/place-stripe", protect, validate(PlaceOrderDTO), orderController.placeOrderStripe);
router.post("/verify-stripe", protect, validate(VerifyStripeDTO), orderController.verifyStripe);
router.get("/", protect, orderController.getUserOrders);

router.get("/all", protect, adminOnly, orderController.getAllOrders);
router.put(
  "/status",
  protect,
  adminOnly,
  validate(UpdateOrderStatusDTO),
  orderController.updateOrderStatus
);

export default router;