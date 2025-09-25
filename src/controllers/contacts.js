import createError from "http-errors";
import { Contact } from "../models/contact.js";

// обгортка для асинхронних функцій
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
// GET all contacts (з пагінацією + сортуванням)
const getAllContacts = async (req, res) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = "name",
        sortOrder = "asc",
    } = req.query;

    const skip = (page - 1) * perPage;
    const totalItems = await Contact.countDocuments();

    const contacts = await Contact.find()
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(Number(perPage));

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: {
            data: contacts,
            page: Number(page),
            perPage: Number(perPage),
            totalItems,
            totalPages: Math.ceil(totalItems / perPage),
            hasPreviousPage: page > 1,
            hasNextPage: page * perPage < totalItems,
        },
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

    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
        new: true,
    });

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

// експорт обгорнутих контролерів
const contactsController = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    deleteContact: ctrlWrapper(deleteContact),
};

export default contactsController;
