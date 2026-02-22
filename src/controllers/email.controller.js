const emailService = require("../services/email.service");
const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../middlewares/error");
const { validateEmailRequest, validateData } = require("../utils/validator");
const getOtpTemplate = require("../templates/otpVerificationTemplate");
const getLinkTemplate = require("../templates/emailVerificationTemplate");

/**
 * Send a simple notification email
 */
const sendNotification = catchAsync(async (req, res) => {
  const { sender, recipient, replyTo, app, subject, message, HTMLfile } = req.body;

  const errors = validateEmailRequest(req.body);
  if (errors.length > 0) {
    throw new APIError(errors.join(", "), 400);
  }

  if (!validateData(message) && !validateData(HTMLfile)) {
    throw new APIError("Enter Valid Email Content (message or HTMLfile required)", 400);
  }

  const msgId = await emailService.sendMail(app, subject, recipient, sender, replyTo, message, HTMLfile);
  await emailService.saveEmailRecord({ ...req.body, messageId: msgId, type: "notification" });

  res.status(200).json({
    success: true,
    data: { messageId: msgId },
    error: null,
  });
});

/**
 * Send an OTP Email (Custom OTP provided in request)
 */
const sendOtp = catchAsync(async (req, res) => {
  const { sender, recipient, replyTo, app, subject, otp, withValidTime, HTMLfile } = req.body;

  const errors = validateEmailRequest(req.body);
  if (errors.length > 0) throw new APIError(errors.join(", "), 400);

  if (!validateData(otp)) throw new APIError("Enter Valid OTP", 400);

  const htmlContent = HTMLfile || getOtpTemplate(app, otp, withValidTime);
  const msgId = await emailService.sendMail(app, subject, recipient, sender, replyTo, otp, htmlContent);
  await emailService.saveEmailRecord({ ...req.body, messageId: msgId, type: "otp" });

  res.status(200).json({
    success: true,
    data: { messageId: msgId },
    error: null,
  });
});

/**
 * Request OTP Email (Auto-generates OTP)
 */
const requestOtp = catchAsync(async (req, res) => {
  const { sender, recipient, replyTo, app, subject, withValidTime } = req.body;

  const errors = validateEmailRequest(req.body);
  if (errors.length > 0) throw new APIError(errors.join(", "), 400);

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit robust OTP
  const htmlContent = getOtpTemplate(app, otp, withValidTime);
  
  const msgId = await emailService.sendMail(app, subject, recipient, sender, replyTo, otp, htmlContent);
  await emailService.saveEmailRecord({ ...req.body, messageId: msgId, type: "otp" });

  res.status(200).json({
    success: true,
    data: { messageId: msgId, otp },
    error: null,
  });
});

/**
 * Send a Link Verification Email
 */
const sendLinkVerification = catchAsync(async (req, res) => {
  const { sender, recipient, replyTo, app, subject, link, withValidTime, HTMLfile } = req.body;

  const errors = validateEmailRequest(req.body);
  if (errors.length > 0) throw new APIError(errors.join(", "), 400);

  if (!validateData(link)) throw new APIError("Enter Valid link", 400);

  const htmlContent = HTMLfile || getLinkTemplate(app, link, withValidTime, replyTo);
  const msgId = await emailService.sendMail(app, subject, recipient, sender, replyTo, link, htmlContent);
  await emailService.saveEmailRecord({ ...req.body, messageId: msgId, type: "link" });

  res.status(200).json({
    success: true,
    data: { messageId: msgId },
    error: null,
  });
});

module.exports = {
  sendNotification,
  sendOtp,
  requestOtp,
  sendLinkVerification,
};
