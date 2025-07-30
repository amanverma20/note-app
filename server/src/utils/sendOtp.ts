import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

// Ensure the API key is available and valid
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
    throw new Error("SENDGRID_API_KEY environment variable is not set");
}
if (!apiKey.startsWith("SG.")) {
    throw new Error("SENDGRID_API_KEY must start with 'SG.'");
}

console.log("SendGrid API Key loaded successfully");
sgMail.setApiKey(apiKey);
const otpStore = new Map<string, string>();

export const generateAndSendOtp = async (email: string) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(email, otp); // store temporarily

        const msg = {
            to: email,
            from: "amanverma15032003@gmail.com",
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
        };

        console.log(`Sending OTP ${otp} to ${email}`);

        await sgMail.send(msg);
        console.log(`OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
};

export const verifyStoredOtp = (email: string, code: string) => {
    const valid = otpStore.get(email) === code;
    if (valid) otpStore.delete(email); // OTP can only be used once
    return valid;
};
