import { Contact } from "../models/contact.js";
import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import Joi from "joi";

const router = Router();

const contactSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("personal", "work"),
});

// Приклад CRUD маршруту

// Отримати всі контакти
router.get("/", async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
});

// Додати новий контакт
router.post("/", validateBody(contactSchema), async (req, res, next) => {
    try {
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
});

// Отримати контакт за id
router.get("/:id", isValidId, async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
});

// Оновити контакт
router.put("/:id", isValidId, validateBody(contactSchema), async (req, res, next) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.json(updatedContact);
    } catch (error) {
        next(error);
    }
});

// Видалити контакт
router.delete("/:id", isValidId, async (req, res, next) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.json({ message: "Contact deleted" });
    } catch (error) {
        next(error);
    }
});

export default router;
