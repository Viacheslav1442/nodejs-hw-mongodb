import express from "express";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../validation/contactValidation.js";

const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:id", contactsController.getContactById);
router.post("/", validateBody(createContactSchema), contactsController.createContact);
router.patch("/:id", validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);

export default router;
