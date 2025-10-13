import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendResetEmail = async (to, link) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${link}">${link}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
};
