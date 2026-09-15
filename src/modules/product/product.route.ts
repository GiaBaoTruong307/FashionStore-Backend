import { Router } from "express";
import * as productController from "./product.controller";
import { validate } from "../../middleware/validate.middleware";
import { CreateProductDTO, UpdateProductDTO } from "./product.dto";
import { protect, adminOnly } from "../../middleware/auth.middleware";
import { upload } from "../../config/multer";

const router = Router();

router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);

router.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 4),
    validate(CreateProductDTO),
    productController.createProduct
);

router.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 4),
    validate(UpdateProductDTO),
    productController.updateProduct
);

router.delete("/:id", protect, adminOnly, productController.deleteProduct);

export default router;