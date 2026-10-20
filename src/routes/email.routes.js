const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");
const catchAsync = require("../utils/catchAsync");
const { ROUTES, SUCCESS_MESSAGES } = require("../constants");

// Simple Notification Email: route calls method passing req.body
router.post(
  ROUTES.EMAILS.SEND,
  catchAsync(async (req, res) => {
    const data = await emailController.sendNotification(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.EMAIL_SENT,
      error: null,
    });
  })
);

// OTP Emails: route calls method passing req.body
router.post(
  ROUTES.EMAILS.OTP_SEND,
  catchAsync(async (req, res) => {
    const data = await emailController.sendOtp(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.OTP_SENT,
      error: null,
    });
  })
);

router.post(
  ROUTES.EMAILS.OTP_REQUEST,
  catchAsync(async (req, res) => {
    const data = await emailController.requestOtp(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.OTP_REQUESTED,
      error: null,
    });
  })
);

// Link Verification Email: route calls method passing req.body
router.post(
  ROUTES.EMAILS.LINK_VERIFICATION,
  catchAsync(async (req, res) => {
    const data = await emailController.sendLinkVerification(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.LINK_SENT,
      error: null,
    });
  })
);

module.exports = router;

