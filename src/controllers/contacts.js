import * as contactsService from "../services/contacts.js";
import { HttpError } from "../utils/HttpError.js";

export const getAll = async (req, res, next) => {
    try {
        const result = await contactsService.getAllContacts();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.getContactById(contactId);
        if (!result) throw HttpError(404, "Contact not found");
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const result = await contactsService.createContact(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.updateContact(contactId, req.body);
        if (!result) throw HttpError(404, "Contact not found");
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contactsService.deleteContact(contactId);
        if (!result) throw HttpError(404, "Contact not found");
        res.json({ message: "Contact deleted" });
    } catch (error) {
        next(error);
    }
};
