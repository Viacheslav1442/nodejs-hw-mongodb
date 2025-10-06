import createError from "http-errors";
import { Contact } from "../models/contact.js";

// Отримати всі контакти
const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

// Отримати контакт по ID
const getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);

        if (!contact) {
            throw createError(404, "Contact not found");
        }

        res.json(contact);
    } catch (error) {
        next(error);
    }
};

// Створити контакт
const createContact = async (req, res, next) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
};

// Оновити контакт
const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

        if (!contact) {
            throw createError(404, "Contact not found");
        }

        res.json(contact);
    } catch (error) {
        next(error);
    }
};

// Видалити контакт
const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            throw createError(404, "Contact not found");
        }

        res.json({ message: "Contact deleted" });
    } catch (error) {
        next(error);
    }
};

export {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};
