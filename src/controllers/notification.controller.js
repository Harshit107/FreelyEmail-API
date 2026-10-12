const emailService = require("../services/email.service");
const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../middlewares/error");
const { isNonEmptyString } = require("../utils/validator");
const { ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");
const getNotificationTemplate = require("../templates/notificationTemplate");
const { ensureValidBaseRequest } = require("./controller.helper");

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

  // Use developer-supplied HTML if given; otherwise wrap text message in responsive template
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
    subject,
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

module.exports = {
  sendNotification,
};
