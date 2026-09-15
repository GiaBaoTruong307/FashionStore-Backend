import { Router } from "express";
import * as cartController from "./cart.controller";
import { validate } from "../../middleware/validate.middleware";
import { AddToCartDTO, UpdateCartDTO } from "./cart.dto";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/", cartController.getCart);
router.post("/add", validate(AddToCartDTO), cartController.addToCart);
router.post("/update", validate(UpdateCartDTO), cartController.updateCart);

export default router;