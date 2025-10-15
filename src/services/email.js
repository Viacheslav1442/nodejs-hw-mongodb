import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendResetEmail = async (to, link) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: "Reset your password",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6">
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${link}" target="_blank">${link}</a>
                <p>This link will expire in 5 minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("❌ Email send error:", error.message);
        throw new Error("Failed to send email");
    }
    console.log("📧 Trying to send email to:", to);
    console.log("SMTP HOST:", process.env.SMTP_HOST);
    console.log("SMTP USER:", process.env.SMTP_USER);

};

