const crypto = require("crypto");
const emailService = require("../services/email.service");
const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../middlewares/error");
const { validateEmailRequest, isNonEmptyString } = require("../utils/validator");
const { ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");
const getOtpTemplate = require("../templates/otpVerificationTemplate");
const getLinkTemplate = require("../templates/emailVerificationTemplate");

const getNotificationTemplate = require("../templates/notificationTemplate");

/**
 * Helper to validate base email request and throw 400 if invalid
 */
const ensureValidBaseRequest = (body) => {
  const errors = validateEmailRequest(body);
  if (errors.length > 0) {
    throw new APIError(errors.join(", "), 400, ERROR_CODES.VALIDATION_ERROR, { validationErrors: errors });
  }
};

/**
 * Send a simple notification email
 * POST /api/v1/emails/send
 */
const sendNotification = catchAsync(async (req, res) => {
  const sender = req.body.sender || "FreelyEmail";
  const recipient = req.body.recipient || req.body.to;
  const app = req.body.app || req.body.appName;
  const subject = req.body.subject;
  const message = req.body.message || req.body.text;
  const rawHTML = req.body.HTMLfile || req.body.html;
  const replyTo = req.body.replyTo;
  const ctaText = req.body.ctaText || req.body.buttonText;
  const ctaUrl = req.body.ctaUrl || req.body.link;

  ensureValidBaseRequest({ ...req.body, sender, recipient, app, subject });

  if (!isNonEmptyString(message) && !isNonEmptyString(rawHTML)) {
    throw new APIError(ERROR_MESSAGES[ERROR_CODES.MISSING_EMAIL_CONTENT], 400, ERROR_CODES.MISSING_EMAIL_CONTENT);
  }

  // Use developer-supplied HTML if given; otherwise wrap text message in our modern responsive template
  const HTMLfile = isNonEmptyString(rawHTML)
    ? rawHTML
    : getNotificationTemplate(app, subject, message, { ctaText, ctaUrl });

  const messageId = await emailService.sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: message,
    html: HTMLfile,
  });

  await emailService.saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    messageId,
    type: "notification",
  });

  res.status(200).json({
    success: true,
    data: { messageId },
    message: SUCCESS_MESSAGES.EMAIL_SENT,
    error: null,
  });
});


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

/**
 * Send a Link Verification Email
 * POST /api/v1/emails/verification/link
 */
const sendLinkVerification = catchAsync(async (req, res) => {
  const sender = req.body.sender || "FreelyEmail";
  const recipient = req.body.recipient || req.body.to;
  const app = req.body.app || req.body.appName;
  const subject = req.body.subject || `Verify your account for ${app || 'FreelyEmail'}`;
  const { replyTo, link, withValidTime = 30, HTMLfile } = req.body;

  ensureValidBaseRequest({ ...req.body, sender, recipient, app, subject });

  if (!isNonEmptyString(link)) {
    throw new APIError(ERROR_MESSAGES[ERROR_CODES.INVALID_LINK], 400, ERROR_CODES.INVALID_LINK);
  }

  const buttonText = req.body.buttonText || "Verify My Email";
  const htmlContent = HTMLfile || getLinkTemplate(app, link, withValidTime, replyTo, { buttonText });

  const messageId = await emailService.sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Please verify your email using this link: ${link}`,
    html: htmlContent,
  });

  await emailService.saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    messageId,
    type: "link",
  });

  res.status(200).json({
    success: true,
    data: { messageId },
    message: SUCCESS_MESSAGES.LINK_SENT,
    error: null,
  });
});

module.exports = {
  sendNotification,
  sendOtp,
  requestOtp,
  sendLinkVerification,
};
