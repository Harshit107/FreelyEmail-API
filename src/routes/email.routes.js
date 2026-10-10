const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");
const { ROUTES } = require("../constants");

// Simple Notification Email
router.post(ROUTES.EMAILS.SEND, emailController.sendNotification);

// OTP Emails
router.post(ROUTES.EMAILS.OTP_SEND, emailController.sendOtp); // User provides OTP
router.post(ROUTES.EMAILS.OTP_REQUEST, emailController.requestOtp); // Auto-generate OTP

// Link Verification Email
router.post(ROUTES.EMAILS.LINK_VERIFICATION, emailController.sendLinkVerification);

module.exports = router;

