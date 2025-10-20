import { HttpError } from "../utils/HttpError.js";
import { Contact } from "../models/contact.js";
import { cloudinaryUpload } from "../utils/cloudinary.js"; // переконайся, що ця утиліта у тебе є

// Отримати всі контакти поточного користувача
const getAllContacts = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
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

// Отримати контакт по ID
const getContactById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const contact = await Contact.findOne({ _id: id, userId });
        if (!contact) throw HttpError(404, "Contact not found");

        res.status(200).json({
            status: 200,
            message: "Successfully retrieved contact!",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// Створити новий контакт (з підтримкою фото)
const createContact = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;

        // Cloudinary або інше сховище повертає посилання в req.file.path
        const photoUrl = req.file?.path || null;

        const newContact = await Contact.create({
            ...req.body,
            userId,
            photo: photoUrl,
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

// Оновити контакт (PATCH, з підтримкою фото)
const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        // Знаходимо контакт
        const contact = await Contact.findOne({ _id: id, userId });
        if (!contact) throw HttpError(404, "Contact not found");

        // --- Оновлюємо фото ---
        if (req.file) {
            // Завантажуємо файл на Cloudinary і отримуємо URL
            const result = await cloudinaryUpload(req.file.path);
            contact.photo = result.secure_url;
        } else if (req.body.photo) {
            // Якщо фото надіслано як URL у JSON
            contact.photo = req.body.photo;
        }

        // --- Оновлюємо інші поля ---
        const allowedFields = ["name", "email", "phone"]; // додай інші поля, якщо потрібно
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                contact[field] = req.body[field];
            }
        });

        // Зберігаємо зміни
        await contact.save();

        res.status(200).json({
            status: 200,
            message: "Successfully updated contact!",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// Видалити контакт
const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id: userId } = req.user;

        const deletedContact = await Contact.findOneAndDelete({ _id: id, userId });
        if (!deletedContact) throw HttpError(404, "Contact not found");

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
