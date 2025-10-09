import createHttpError from "http-errors";
import { Contact } from "../models/contact.js";

// ✅ Отримати всі контакти поточного користувача
const getAllContacts = async (req, res, next) => {
    try {
        const { _id: userId } = req.user; // кожен користувач бачить лише свої контакти
        const contacts = await Contact.find({ userId });

        res.status(200).json({
            status: 200,
            message: "Successfully retrieved all contacts!",
            data: contacts,
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Отримати контакт по ID (тільки свій)
const getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const contact = await Contact.findOne({ _id: id, userId });
        if (!contact) {
            throw createHttpError(404, "Contact not found");
        }

        res.status(200).json({
            status: 200,
            message: "Successfully retrieved contact!",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Створити контакт (додає userId)
const createContact = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const newContact = await Contact.create({ ...req.body, userId });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Оновити контакт (тільки свій)
const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const updatedContact = await Contact.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );

        if (!updatedContact) {
            throw createHttpError(404, "Contact not found");
        }

        res.status(200).json({
            status: 200,
            message: "Successfully updated contact!",
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
};

// ✅ Видалити контакт (тільки свій)
const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const deletedContact = await Contact.findOneAndDelete({ _id: id, userId });
        if (!deletedContact) {
            throw createHttpError(404, "Contact not found");
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};
