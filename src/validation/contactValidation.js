import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().max(20).required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("personal", "work"),
    photo: Joi.string().uri().optional(), // 🆕 додано
});

export const updateContactSchema = Joi.object({
    name: Joi.string().max(20),
    phoneNumber: Joi.string(),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("personal", "work"),
    photo: Joi.string().uri().optional(), // 🆕 додано
});
