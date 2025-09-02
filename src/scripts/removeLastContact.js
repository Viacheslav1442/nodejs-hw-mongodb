import { readContacts } from "../utils/readContacts.js";
import { writeContacts } from "../utils/writeContacts.js";

const removeLastContact = async () => {
    const contacts = await readContacts();

    if (contacts.length === 0) {
        console.log("⚠️ Немає контактів для видалення.");
        return;
    }

    const removed = contacts.pop();
    await writeContacts(contacts);

    console.log("❌ Видалено останній контакт:", removed);
};

removeLastContact();
