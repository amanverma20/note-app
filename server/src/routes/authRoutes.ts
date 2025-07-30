import express from "express";
import {
    sendOtpHandler,
    verifyOtpSignupHandler,
    verifyOtpLoginHandler,
} from "../controllers/authController";
import { verifyGoogleLogin } from "../controllers/verifyGoogleToken";
import { verifyGoogleSignup } from "../controllers/verifyGoogleToken";

const router = express.Router();

router.post("/send-otp", sendOtpHandler);
router.post("/verify-otp-signup", verifyOtpSignupHandler);
router.post("/verify-otp-login", verifyOtpLoginHandler);
router.post("/google-login", verifyGoogleLogin);
router.post("/google-signup", verifyGoogleSignup);

export default router;