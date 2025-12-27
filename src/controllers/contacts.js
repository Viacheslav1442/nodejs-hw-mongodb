import createError from "http-errors";
import { Contact } from "../models/contact.js";

// ctrlWrapper обгортає асинхронні контролери
const ctrlWrapper = (ctrl) => {
    return async (req, res, next) => {
        try {
            await ctrl(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

// GET all contacts
const getAllContacts = async (req, res) => {
    const contacts = await Contact.find();
    res.json({
        status: 200,
        message: "Successfully found contacts",
        data: contacts,
    });
};

// GET one contact
const getContactById = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
        throw createError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully found contact",
        data: contact,
    });
};

// POST new contact
const addContact = async (req, res) => {
    const newContact = await Contact.create(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created contact",
        data: newContact,
    });
};

// PATCH update contact
const updateContact = async (req, res) => {
    const { id } = req.params;

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedContact) {
        throw createError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully updated contact",
        data: updatedContact,
    });
};

// DELETE contact
const deleteContact = async (req, res) => {
    const { id } = req.params;

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
        throw createError(404, "Contact not found");
    }

    res.status(204).send();
};

// Default export об’єкта з обгорнутими функціями
export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
};
