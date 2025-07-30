"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleSignup = exports.verifyGoogleLogin = void 0;
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verifyGoogleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: "Invalid Google token" });
            return;
        }
        const { email, name } = payload;
        let user = yield User_1.User.findOne({ email });
        if (!user) {
            user = yield User_1.User.create({ email, name });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ success: true, token, user });
    }
    catch (err) {
        console.error("Google login error", err);
        res.status(500).json({ error: "Google login failed" });
    }
});
exports.verifyGoogleLogin = verifyGoogleLogin;
const verifyGoogleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_token } = req.body;
    try {
        const ticket = yield client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: "Invalid Google token" });
            return;
        }
        const { email, name } = payload;
        let user = yield User_1.User.findOne({ email });
        if (user) {
            res.status(400).json({ error: "User already exists, please log in instead" });
            return;
        }
        user = yield User_1.User.create({ email, name });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.json({ success: true, token, user });
    }
    catch (err) {
        console.error("Google signup error", err);
        res.status(500).json({ error: "Google signup failed" });
    }
});
exports.verifyGoogleSignup = verifyGoogleSignup;
