import express from "express";
import Joi from "joi";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Схема для додавання нового контакту
const addContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required(),
    favorite: Joi.boolean(),
});

// Схема для оновлення контакту
const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]+$/),
    favorite: Joi.boolean(),
}).min(1);

// Всі маршрути доступні тільки для авторизованих користувачів
router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:id", contactsController.getContactById);
router.post("/", validateBody(addContactSchema), contactsController.addContact);
router.patch("/:id", validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);

export default router;
