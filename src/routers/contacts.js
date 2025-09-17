import { Router } from "express";
import * as contactsCtrl from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import Joi from "joi";

const router = Router();

const contactSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("personal", "work"),
});

router.get("/", contactsCtrl.getAll);
router.get("/:contactId", isValidId, contactsCtrl.getById);
router.post("/", validateBody(contactSchema), contactsCtrl.create);
router.put("/:contactId", isValidId, validateBody(contactSchema), contactsCtrl.update);
router.delete("/:contactId", isValidId, contactsCtrl.remove);

export default router;
