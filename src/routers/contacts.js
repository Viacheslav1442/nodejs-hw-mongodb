import express from "express";
import contactsController from "../controllers/contacts.js"; // default import
import { validateBody } from "../middlewares/validateBody.js";
import Joi from "joi";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();


const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

const addContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(phoneRegex).required(),
    favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(phoneRegex),
    favorite: Joi.boolean(),
}).min(1);


router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:id", contactsController.getContactById);
router.post("/", validateBody(addContactSchema), contactsController.createContact);
router.patch("/:id", validateBody(updateContactSchema), contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);

export default router;
