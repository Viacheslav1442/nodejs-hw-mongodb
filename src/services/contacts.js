import { Contact } from "../models/contact.js";


export const getAllContacts = async (userId) => {
    return Contact.find({ userId });
};


export const getContactById = async (id, userId) => {
    return Contact.findOne({ _id: id, userId });
};
