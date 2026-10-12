const emailService = require("../services/email.service");
const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../middlewares/error");
const { isNonEmptyString } = require("../utils/validator");
const { ERROR_CODES, ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants");
const getLinkTemplate = require("../templates/emailVerificationTemplate");
const { ensureValidBaseRequest } = require("./controller.helper");

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
    subject,
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
  sendLinkVerification,
};
