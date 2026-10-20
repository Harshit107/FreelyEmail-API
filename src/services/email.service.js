const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Email = require("../models/email.model");
const centralLogger = require("./centralLogger.service");
const { APIError } = require("../middlewares/error");
const { DEFAULT_CONFIG, ERROR_CODES, ERROR_MESSAGES } = require("../constants");
const { isNonEmptyString, ensureValidBaseRequest } = require("../utils/validator");
const getNotificationTemplate = require("../templates/notificationTemplate");
const getOtpTemplate = require("../templates/otpVerificationTemplate");
const getLinkTemplate = require("../templates/emailVerificationTemplate");

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const authEmail =
    process.env.BREVO_EMAIL ||
    process.env.BREVO_SMTP_USER ||
    process.env.SENDINBLUE_EMAIL ||
    process.env.SMTP_USER;

  const authPass =
    process.env.BREVO_PASSWORD ||
    process.env.BREVO_SMTP_KEY ||
    process.env.SENDINBLUE_PASSWORD ||
    process.env.SMTP_PASSWORD;

  if (!authEmail || !authPass) {
    throw new APIError(ERROR_MESSAGES[ERROR_CODES.SMTP_NOT_CONFIGURED], 500, ERROR_CODES.SMTP_NOT_CONFIGURED);
  }

  const host = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || DEFAULT_CONFIG.SMTP_HOST;
  const port = parseInt(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || DEFAULT_CONFIG.SMTP_PORT, 10);
  const isSecure = port === 465;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: authEmail,
      pass: authPass,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  return cachedTransporter;
};

/**
 * Sends transactional email via Brevo REST API
 */
const sendViaBrevoAPI = async (apiKey, options) => {
  const url = "https://api.brevo.com/v3/smtp/email";
  const payload = {
    sender: {
      name: options.appName || "FreelyEmail",
      email: options.fromEmail,
    },
    to: [{ email: options.to }],
    subject: options.subject,
    ...(options.replyTo && { replyTo: { email: options.replyTo } }),
    ...(options.text ? { textContent: options.text } : {}),
    ...(options.html ? { htmlContent: options.html } : {}),
  };

  // Ensure Brevo has at least one content field
  if (!payload.textContent && !payload.htmlContent) {
    payload.textContent = " ";
  }

  let lastError;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.message || data.error || (data.errors ? JSON.stringify(data.errors) : "Brevo API delivery failed");

        // If 429 rate limited or 5xx server issue, retry with backoff
        if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt)));
          continue;
        }
        throw new Error(errorMsg);
      }

      return (data.messageId || "").replace(/[<>]/g, "");
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
};


/**
 * Verifies Brevo SMTP or API connection configuration
 * @returns {Promise<boolean>}
 */
const verifyConnection = async () => {
  const brevoApiKey =
    process.env.BREVO_API_KEY ||
    (process.env.BREVO_PASSWORD && process.env.BREVO_PASSWORD.startsWith("xkeysib-")
      ? process.env.BREVO_PASSWORD
      : null);

  if (brevoApiKey) {
    const response = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": brevoApiKey },
    });
    if (!response.ok) {
      throw new Error(`Brevo API verification failed: ${response.statusText}`);
    }
    return true;
  }

  const transporter = getTransporter();
  return await transporter.verify();
};

// Clean strings to prevent email header injection
const sanitizeHeader = (str) => {
  if (!str) return "";
  return String(str).replace(/[\r\n]/g, "").trim();
};

/**
 * Sends an email using Brevo (API or SMTP Transport)
 * Supports both options object or positional arguments for compatibility
 */
const sendMail = async (optionsOrApp, subject, recipient, sender, replyTo, message, htmlContent) => {
  let opts = {};

  if (typeof optionsOrApp === "object" && optionsOrApp !== null) {
    opts = optionsOrApp;
  } else {
    opts = {
      app: optionsOrApp,
      subject,
      recipient,
      sender,
      replyTo,
      text: message,
      html: htmlContent,
    };
  }

  const domain = process.env.DEFAULT_FROM_DOMAIN || DEFAULT_CONFIG.DEFAULT_FROM_DOMAIN;
  const cleanApp = sanitizeHeader(opts.app);
  const cleanSender = sanitizeHeader(opts.sender);
  const cleanSubject = sanitizeHeader(opts.subject);

  // Centralized sender email: change in constants/index.js (or .env DEFAULT_FROM_EMAIL). Request body is ignored.
  const fromEmail = sanitizeHeader(
    DEFAULT_CONFIG.DEFAULT_FROM_EMAIL || process.env.DEFAULT_FROM_EMAIL || `noreply@${domain}`
  );

  const replyToEmail = opts.replyTo ? sanitizeHeader(opts.replyTo) : fromEmail;
  const emailText = opts.text || opts.message || "";
  const emailHtml = opts.html || opts.HTMLfile || undefined;

  // Prefer Brevo REST API when api-key is configured
  const brevoApiKey =
    process.env.BREVO_API_KEY ||
    (process.env.BREVO_PASSWORD && process.env.BREVO_PASSWORD.startsWith("xkeysib-")
      ? process.env.BREVO_PASSWORD
      : null);

  if (brevoApiKey) {
    try {
      return await sendViaBrevoAPI(brevoApiKey, {
        appName: cleanApp,
        fromEmail,
        to: opts.recipient,
        replyTo: replyToEmail,
        subject: cleanSubject,
        text: emailText,
        html: emailHtml,
      });
    } catch (error) {
      throw new APIError(`Failed to send email via Brevo: ${error.message}`, 500, ERROR_CODES.EMAIL_SEND_FAILED, { originalError: error.message });
    }
  }

  // Fallback to Nodemailer SMTP Transport
  const transporter = getTransporter();
  const mailOptions = {
    from: `"${cleanApp}" <${fromEmail}>`,
    to: opts.recipient,
    replyTo: replyToEmail,
    subject: cleanSubject,
    text: emailText,
    html: emailHtml,
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    return info.messageId.replace(/[<>]/g, "");
  } catch (error) {
    throw new APIError(`Failed to send email: ${error.message}`, 500, ERROR_CODES.EMAIL_SEND_FAILED, { originalError: error.message });
  }
};

/**
 * Saves email record to the database
 */
const saveEmailRecord = async (emailData = {}) => {
  try {
    const { sender, recipient, replyTo, messageId, app, type = "notification", subject, metadata } = emailData;

    // Asynchronously dispatch audit trail to Central Logging Service
    centralLogger.logUserData({
      messageId,
      sender,
      recipient,
      replyTo,
      app,
      subject,
      type,
      status: "dispatched",
      metadata,
    }).catch(() => { });

    return await Email.create({
      sender,
      recipient,
      replyTo,
      messageId,
      app,
      type,
    });
  } catch (error) {
    // Non-blocking: we don't throw to avoid failing email dispatch if DB fails
    return null;
  }
};

/**
 * Task Method: Sends a standard notification email from a provided body/payload.
 * Can be executed from HTTP routes or directly from any module/script.
 *
 * @param {Object} body - Email payload
 * @returns {Promise<{ messageId: string }>}
 */
const sendNotification = async (body = {}) => {
  const sender = body.sender || "FreelyEmail";
  const recipient = body.recipient || body.to;
  const app = body.app || body.appName;
  const subject = body.subject;
  const message = body.message || body.text;
  const rawHTML = body.HTMLfile || body.html;
  const replyTo = body.replyTo;
  const ctaText = body.ctaText || body.buttonText;
  const ctaUrl = body.ctaUrl || body.link;

  ensureValidBaseRequest({ ...body, sender, recipient, app, subject });

  if (!isNonEmptyString(message) && !isNonEmptyString(rawHTML)) {
    throw new APIError(
      ERROR_MESSAGES[ERROR_CODES.MISSING_EMAIL_CONTENT],
      400,
      ERROR_CODES.MISSING_EMAIL_CONTENT
    );
  }

  // Use developer-supplied HTML if given; otherwise wrap text message in responsive template
  const HTMLfile = isNonEmptyString(rawHTML)
    ? rawHTML
    : getNotificationTemplate(app, subject, message, { ctaText, ctaUrl });

  const messageId = await sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: message,
    html: HTMLfile,
  });

  await saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    subject,
    messageId,
    type: "notification",
  });

  return { messageId };
};

/**
 * Task Method: Sends a custom OTP email from a provided body/payload.
 *
 * @param {Object} body - Email payload
 * @returns {Promise<{ messageId: string }>}
 */
const sendOtp = async (body = {}) => {
  const sender = body.sender || "FreelyEmail";
  const recipient = body.recipient || body.to;
  const app = body.app || body.appName;
  const subject = body.subject || `Your ${app || "Verification"} Code`;
  const { replyTo, otp, withValidTime = 10, HTMLfile } = body;

  ensureValidBaseRequest({ ...body, sender, recipient, app, subject });

  if (!isNonEmptyString(otp)) {
    throw new APIError(
      ERROR_MESSAGES[ERROR_CODES.INVALID_OTP],
      400,
      ERROR_CODES.INVALID_OTP
    );
  }

  const htmlContent = HTMLfile || getOtpTemplate(app, otp, withValidTime);

  const messageId = await sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Your verification code is: ${otp}`,
    html: htmlContent,
  });

  await saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    subject,
    messageId,
    type: "otp",
  });

  return { messageId };
};

/**
 * Task Method: Auto-generates a secure 6-digit OTP and dispatches email.
 *
 * @param {Object} body - Email payload
 * @returns {Promise<{ messageId: string, otp: string }>}
 */
const requestOtp = async (body = {}) => {
  const sender = body.sender || "FreelyEmail";
  const recipient = body.recipient || body.to;
  const app = body.app || body.appName;
  const subject = body.subject || `Your ${app || "Verification"} Code`;
  const { replyTo, withValidTime = 10 } = body;

  ensureValidBaseRequest({ ...body, sender, recipient, app, subject });

  // Generate a cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();
  const htmlContent = getOtpTemplate(app, otp, withValidTime);

  const messageId = await sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Your verification code is: ${otp}`,
    html: htmlContent,
  });

  await saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    subject,
    messageId,
    type: "otp",
  });

  return { messageId, otp };
};

/**
 * Task Method: Sends a verification link email from a provided body/payload.
 *
 * @param {Object} body - Email payload
 * @returns {Promise<{ messageId: string }>}
 */
const sendLinkVerification = async (body = {}) => {
  const sender = body.sender || "FreelyEmail";
  const recipient = body.recipient || body.to;
  const app = body.app || body.appName;
  const subject = body.subject || `Verify your account for ${app || "FreelyEmail"}`;
  const { replyTo, link, withValidTime = 30, HTMLfile } = body;

  ensureValidBaseRequest({ ...body, sender, recipient, app, subject });

  if (!isNonEmptyString(link)) {
    throw new APIError(
      ERROR_MESSAGES[ERROR_CODES.INVALID_LINK],
      400,
      ERROR_CODES.INVALID_LINK
    );
  }

  const buttonText = body.buttonText || "Verify My Email";
  const htmlContent =
    HTMLfile || getLinkTemplate(app, link, withValidTime, replyTo, { buttonText });

  const messageId = await sendMail({
    app,
    subject,
    recipient,
    sender,
    replyTo,
    text: `Please verify your email using this link: ${link}`,
    html: htmlContent,
  });

  await saveEmailRecord({
    sender,
    recipient,
    replyTo,
    app,
    subject,
    messageId,
    type: "link",
  });

  return { messageId };
};

/**
 * Universal dispatcher: dispatches any email based on payload structure or type
 *
 * @param {Object} body
 * @returns {Promise<Object>}
 */
const dispatchEmail = async (body = {}) => {
  const type = (body.type || "").toLowerCase();
  if (type === "otp" || body.otp) {
    return await sendOtp(body);
  }
  if (type === "otp_request" || type === "request_otp") {
    return await requestOtp(body);
  }
  if (type === "link" || type === "verification" || body.link) {
    return await sendLinkVerification(body);
  }
  return await sendNotification(body);
};

module.exports = {
  // High-level task methods that accept body/payload
  sendNotification,
  sendOtp,
  requestOtp,
  sendLinkVerification,
  dispatchEmail,

  // Low-level transport & logging methods
  sendMail,
  saveEmailRecord,
  verifyConnection,
};

