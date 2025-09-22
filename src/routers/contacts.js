import { Router } from "express";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import Joi from "joi";

const router = Router();

const contactSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("personal", "work"),
});

// GET all contacts
router.get("/", contactsController.getAllContacts);

// GET one contact
router.get("/:id", contactsController.getContactById);

// POST new contact
router.post("/", validateBody(contactSchema), contactsController.addContact);

// PATCH update contact
router.patch("/:id", validateBody(contactSchema), contactsController.updateContact);

// DELETE contact
router.delete("/:id", contactsController.deleteContact);

export default router;
