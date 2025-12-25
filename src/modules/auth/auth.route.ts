import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { RegisterDTO, LoginDTO } from "./auth.dto";

const router = Router();

router.post("/register", validate(RegisterDTO), authController.registerUser);
router.post("/login", validate(LoginDTO), authController.loginController);

export default router;
