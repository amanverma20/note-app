import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleLogin = async (req: Request, res: Response): Promise<void> => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: "Invalid Google token" });
            return;
        }

        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.json({ success: true, token, user });
    } catch (err) {
        console.error("Google login error", err);
        res.status(500).json({ error: "Google login failed" });
    }
};

export const verifyGoogleSignup = async (req: Request, res: Response): Promise<void> => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: "Invalid Google token" });
            return;
        }

        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({ error: "User already exists, please log in instead" });
            return;
        }

        user = await User.create({ email, name });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.json({ success: true, token, user });
    } catch (err) {
        console.error("Google signup error", err);
        res.status(500).json({ error: "Google signup failed" });
    }
};
