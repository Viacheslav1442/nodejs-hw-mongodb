import express from "express";
import {
    register,
    login,
    refresh,
    logout,
    resetPasswordController,
    sendResetEmailController
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";
import { resetPasswordSchema } from "../validation/resetPwdValidation.js";
import { sendResetEmailSchema } from "../validation/resetEmailValidation.js";

const router = express.Router();

// ------------------ РЕЄСТРАЦІЯ ------------------
router.post("/register", validateBody(registerSchema), register);

// ------------------ ЛОГІН ------------------
router.post("/login", validateBody(loginSchema), login);

// ------------------ REFRESH ------------------
router.post("/refresh", refresh);

// ------------------ LOGOUT ------------------
router.post("/logout", logout);

// ------------------ SEND RESET EMAIL ------------------
router.post(
    "/send-reset-email",
    validateBody(sendResetEmailSchema),
    sendResetEmailController
);

// ------------------ RESET PASSWORD ------------------
router.post(
    "/reset-pwd",
    validateBody(resetPasswordSchema),
    resetPasswordController
);

export default router;
