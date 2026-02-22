const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");

// Simple Notification Email
router.post("/send", emailController.sendNotification);

// OTP Emails
router.post("/otp/send", emailController.sendOtp); // User provides OTP
router.post("/otp/request", emailController.requestOtp); // Auto-generate OTP

// Link Verification Email
router.post("/verification/link", emailController.sendLinkVerification);

module.exports = router;
