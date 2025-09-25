import { Router } from "express";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contactValidation.js";

const router = Router();

// GET all contacts
router.get("/", contactsController.getAllContacts);

// GET one contact
router.get("/:id", contactsController.getContactById);

// POST new contact
router.post("/", validateBody(createContactSchema), contactsController.addContact);

// PATCH update contact
router.patch("/:id", validateBody(updateContactSchema), contactsController.updateContact);

// DELETE contact
router.delete("/:id", contactsController.deleteContact);

export default router;
