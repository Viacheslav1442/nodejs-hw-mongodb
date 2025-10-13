import express from "express";
import { register, login, refresh, logout } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";
import { resetPasswordController } from "../controllers/auth.js";
import { resetPasswordSchema } from "../validation/resetPwdValidation.js";
import { sendResetEmailSchema } from "../validation/resetEmailValidation.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.post(
    "/send-reset-email",
    validateBody(sendResetEmailSchema),
    sendResetEmailController
);

router.post(
    "/reset-pwd",
    validateBody(resetPasswordSchema),
    resetPasswordController
);

export default router;
