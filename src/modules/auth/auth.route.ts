import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { RegisterDTO, LoginDTO } from "./auth.dto";
import { protect } from "../../middleware/auth.middleware";
import { authLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, validate(RegisterDTO), authController.registerUser);
router.post("/login", authLimiter, validate(LoginDTO), authController.loginController);
router.get("/me", protect, authController.getMe);

export default router;