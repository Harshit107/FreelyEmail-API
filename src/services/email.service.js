const nodemailer = require("nodemailer");
const Email = require("../models/email.model");
const { APIError } = require("../middlewares/error");
const { DEFAULT_CONFIG, ERROR_CODES, ERROR_MESSAGES } = require("../constants");

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
    const { sender, recipient, replyTo, messageId, app, type = "notification" } = emailData;
    return await Email.create({
      sender,
      recipient,
      replyTo,
      messageId,
      app,
      type,
    });
  } catch (error) {
    console.error("Failed to save email record to DB:", error.message);
    // Non-blocking log: we don't throw to avoid failing email dispatch if DB fails
    return null;
  }
};

module.exports = {
  sendMail,
  saveEmailRecord,
  verifyConnection,
};
