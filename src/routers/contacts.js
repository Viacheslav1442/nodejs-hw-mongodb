import express from "express";
import contactsController from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import Joi from "joi";

const router = express.Router();

const addContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required(),
    favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]+$/),
    favorite: Joi.boolean(),
}).min(1);

const {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} = contactsController;

router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.post("/", validateBody(addContactSchema), createContact);
router.patch("/:id", validateBody(updateContactSchema), updateContact);
router.delete("/:id", deleteContact);

export default router;
