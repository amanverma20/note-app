import express from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";

const router = express.Router();

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.userId).select("name email");
        res.json(user);
    } catch {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;
