import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { generateAndSendOtp, verifyStoredOtp } from "../utils/sendOtp";

// ✅ Shared JWT helper
const createToken = (userId: string): string =>
    jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const verifyOtpSignupHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, dob, email, otp } = req.body;

    try {
        const isValid = verifyStoredOtp(email, otp);
        if (!isValid) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, dob, email });
        }

        const token = createToken(user._id.toString());
        res.status(200).json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup OTP verification failed" });
    }
};

export const verifyOtpLoginHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: "No user found with this email" });
            return;
        }

        const isValid = verifyStoredOtp(email, otp);
        if (!isValid) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }


        const token = createToken(user._id.toString());
        res.status(200).json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login OTP verification failed" });
    }
};

// ✅ Send OTP to email (used in both flows)
export const sendOtpHandler = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    try {
        await generateAndSendOtp(email);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};
