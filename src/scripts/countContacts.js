import { readContacts } from "../utils/readContacts.js";

const countContacts = async () => {
    const contacts = await readContacts();
    console.log(`📊 Кількість контактів: ${contacts.length}`);
    return contacts.length;
};

countContacts();
