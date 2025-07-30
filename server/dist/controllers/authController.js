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
exports.sendOtpHandler = exports.verifyOtpLoginHandler = exports.verifyOtpSignupHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const sendOtp_1 = require("../utils/sendOtp");
// ✅ Shared JWT helper
const createToken = (userId) => jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
const verifyOtpSignupHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, dob, email, otp } = req.body;
    try {
        const isValid = (0, sendOtp_1.verifyStoredOtp)(email, otp);
        if (!isValid) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }
        let user = yield User_1.User.findOne({ email });
        if (!user) {
            user = yield User_1.User.create({ name, dob, email });
        }
        const token = createToken(user._id.toString());
        res.status(200).json({ success: true, token, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup OTP verification failed" });
    }
});
exports.verifyOtpSignupHandler = verifyOtpSignupHandler;
const verifyOtpLoginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ error: "No user found with this email" });
            return;
        }
        const isValid = (0, sendOtp_1.verifyStoredOtp)(email, otp);
        if (!isValid) {
            res.status(400).json({ error: "Invalid OTP" });
            return;
        }
        const token = createToken(user._id.toString());
        res.status(200).json({ success: true, token, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login OTP verification failed" });
    }
});
exports.verifyOtpLoginHandler = verifyOtpLoginHandler;
// ✅ Send OTP to email (used in both flows)
const sendOtpHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, sendOtp_1.generateAndSendOtp)(email);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});
exports.sendOtpHandler = sendOtpHandler;
