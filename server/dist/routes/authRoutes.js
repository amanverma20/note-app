"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const verifyGoogleToken_1 = require("../controllers/verifyGoogleToken");
const verifyGoogleToken_2 = require("../controllers/verifyGoogleToken");
const router = express_1.default.Router();
router.post("/send-otp", authController_1.sendOtpHandler);
router.post("/verify-otp-signup", authController_1.verifyOtpSignupHandler);
router.post("/verify-otp-login", authController_1.verifyOtpLoginHandler);
router.post("/google-login", verifyGoogleToken_1.verifyGoogleLogin);
router.post("/google-signup", verifyGoogleToken_2.verifyGoogleSignup);
exports.default = router;
