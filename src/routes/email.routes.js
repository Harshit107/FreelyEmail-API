const express = require("express");
const router = express.Router();
const emailController = require("../controllers/email.controller");
const catchAsync = require("../utils/catchAsync");
const { ROUTES, SUCCESS_MESSAGES } = require("../constants");

// ============================================================================
// Notification Emails (Sync & Async)
// ============================================================================

// Dedicated Sync Notification Route (supports ?mode=async or ?async=true as well)
router.post(
  ROUTES.EMAILS.NOTIFICATION,
  catchAsync(async (req, res) => {
    if (req.query.async === "true" || req.query.mode === "async") {
      return await emailController.sendNotificationAsync(req, res);
    }
    return await emailController.sendNotificationSync(req, res);
  })
);

// Dedicated Async Notification Route (fire-and-forget, 202 Accepted)
router.post(
  ROUTES.EMAILS.NOTIFICATION_ASYNC,
  catchAsync(emailController.sendNotificationAsync)
);

// Backward-compatible Legacy Send Route
router.post(
  ROUTES.EMAILS.SEND,
  catchAsync(async (req, res) => {
    if (req.query.async === "true" || req.query.mode === "async") {
      return await emailController.sendNotificationAsync(req, res);
    }
    const data = await emailController.sendNotification(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.EMAIL_SENT,
      error: null,
    });
  })
);

// ============================================================================
// Link Verification Emails (Sync & Async)
// ============================================================================

// Dedicated Sync Link Route (supports ?mode=async or ?async=true as well)
router.post(
  ROUTES.EMAILS.LINK,
  catchAsync(async (req, res) => {
    if (req.query.async === "true" || req.query.mode === "async") {
      return await emailController.sendLinkAsync(req, res);
    }
    return await emailController.sendLinkSync(req, res);
  })
);

// Dedicated Async Link Route (fire-and-forget, 202 Accepted)
router.post(
  ROUTES.EMAILS.LINK_ASYNC,
  catchAsync(emailController.sendLinkAsync)
);

// Backward-compatible Legacy Link Verification Route
router.post(
  ROUTES.EMAILS.LINK_VERIFICATION,
  catchAsync(async (req, res) => {
    if (req.query.async === "true" || req.query.mode === "async") {
      return await emailController.sendLinkAsync(req, res);
    }
    const data = await emailController.sendLinkVerification(req.body);
    res.status(200).json({
      success: true,
      data,
      message: SUCCESS_MESSAGES.LINK_SENT,
      error: null,
    });
  })
);

// ============================================================================
// OTP Emails
// ============================================================================

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

module.exports = router;
