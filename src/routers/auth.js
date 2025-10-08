import express from "express";
import Joi from "joi";
import { register, login, refresh, logout } from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";

const router = express.Router();

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
