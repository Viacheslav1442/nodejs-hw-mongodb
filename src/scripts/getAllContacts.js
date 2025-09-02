import { readContacts } from "../utils/readContacts.js";

const getAllContacts = async () => {
    const contacts = await readContacts();
    console.log("📋 Всі контакти:", contacts);
    return contacts;
};

getAllContacts();
