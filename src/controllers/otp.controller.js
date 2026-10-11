const crypto = require("crypto");
const emailService = require("../services/email.service");
const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../middlewares/error");
const { isNonEmptyString } = require("../utils/validator");
const { ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");
const getOtpTemplate = require("../templates/otpVerificationTemplate");
const { ensureValidBaseRequest } = require("./controller.helper");

/**
 * Send an OTP Email (Custom OTP provided in request)
 * POST /api/v1/emails/otp/send
 */
const sendOtp = catchAsync(async (req, res) => {
  const sender = req.body.sender || "FreelyEmail";
  const recipient = req.body.recipient || req.body.to;
  const app = req.body.app || req.body.appName;
  const subject = req.body.subject || `Your ${app || 'Verification'} Code`;
  const { replyTo, otp, withValidTime = 10, HTMLfile } = req.body;

  ensureValidBaseRequest({ ...req.body, sender, recipient, app, subject });

  if (!isNonEmptyString(otp)) {
    throw new APIError(ERROR_MESSAGES[ERROR_CODES.INVALID_OTP], 400, ERROR_CODES.INVALID_OTP);
  }

  const htmlContent = HTMLfile || getOtpTemplate(app, otp, withValidTime);

  const messageId = await emailService.sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Your verification code is: ${otp}`,
    html: htmlContent,
  });

  await emailService.saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    messageId,
    type: "otp",
  });

  res.status(200).json({
    success: true,
    data: { messageId },
    message: SUCCESS_MESSAGES.OTP_SENT,
    error: null,
  });
});

/**
 * Request OTP Email (Auto-generates a secure 6-digit OTP)
 * POST /api/v1/emails/otp/request
 */
const requestOtp = catchAsync(async (req, res) => {
  const sender = req.body.sender || "FreelyEmail";
  const recipient = req.body.recipient || req.body.to;
  const app = req.body.app || req.body.appName;
  const subject = req.body.subject || `Your ${app || 'Verification'} Code`;
  const { replyTo, withValidTime = 10 } = req.body;

  ensureValidBaseRequest({ ...req.body, sender, recipient, app, subject });

  // Generate a cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const htmlContent = getOtpTemplate(app, otp, withValidTime);

  const messageId = await emailService.sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Your verification code is: ${otp}`,
    html: htmlContent,
  });

  await emailService.saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    messageId,
    type: "otp",
  });

  res.status(200).json({
    success: true,
    data: { messageId, otp },
    message: SUCCESS_MESSAGES.OTP_REQUESTED,
    error: null,
  });
});

module.exports = {
  sendOtp,
  requestOtp,
};
