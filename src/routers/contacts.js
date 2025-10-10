import express from "express";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { createContactSchema, updateContactSchema } from "../validation/contactValidation.js";

const router = express.Router();

router.use(authenticate);

// Отримати всі контакти
router.get("/", contactsController.getAllContacts);

// Отримати один контакт
router.get("/:id", contactsController.getContactById);

// Створити контакт
router.post("/", validateBody(createContactSchema), contactsController.createContact);

// Оновити контакт
router.patch("/:id", validateBody(updateContactSchema), contactsController.updateContact);

// Видалити контакт
router.delete("/:id", contactsController.deleteContact);

export default router;
