import { Schema, model } from "mongoose";

const contactSchema = new Schema(
    {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        isFavourite: { type: Boolean, default: false },
        contactType: {
            type: String,
            enum: ["personal", "work"],
            default: "personal",
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true, versionKey: false }
);

export const Contact = model("Contact", contactSchema);
