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
exports.verifyStoredOtp = exports.generateAndSendOtp = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure dotenv is loaded
dotenv_1.default.config();
// Ensure the API key is available and valid
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
    throw new Error("SENDGRID_API_KEY environment variable is not set");
}
if (!apiKey.startsWith("SG.")) {
    throw new Error("SENDGRID_API_KEY must start with 'SG.'");
}
console.log("SendGrid API Key loaded successfully");
mail_1.default.setApiKey(apiKey);
const otpStore = new Map();
const generateAndSendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield mail_1.default.send(msg);
        console.log(`OTP sent successfully to ${email}`);
        return true;
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        throw error;
    }
});
exports.generateAndSendOtp = generateAndSendOtp;
const verifyStoredOtp = (email, code) => {
    const valid = otpStore.get(email) === code;
    if (valid)
        otpStore.delete(email); // OTP can only be used once
    return valid;
};
exports.verifyStoredOtp = verifyStoredOtp;
