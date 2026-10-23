const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");

/**
 * Task Method & Route Controller for sending a notification email (Synchronous).
 * - Called from routes: pass req.body or (req, res)
 * - Called directly from any module: sendNotification(body)
 *
 * @param {Object} bodyOrReq
 * @param {Object} [res]
 * @returns {Promise<{ messageId: string }>}
 */
const sendNotification = async (bodyOrReq, res) => {
  // Direct function call from any module/script: sendNotification(body)
  if (!res || typeof res.status !== "function") {
    const body = bodyOrReq && bodyOrReq.body ? bodyOrReq.body : bodyOrReq;
    return await emailService.sendNotification(body);
  }

  // Express middleware invocation: sendNotification(req, res)
  const data = await emailService.sendNotification(bodyOrReq.body);
  return res.status(200).json({
    success: true,
    data,
    message: SUCCESS_MESSAGES.EMAIL_SENT,
    error: null,
  });
};

/**
 * Synchronous Route Controller: Awaits SMTP dispatch and returns messageId
 */
const sendNotificationSync = async (req, res) => {
  const body = req.body || {};
  const data = await emailService.sendNotification(body);
  return res.status(200).json({
    success: true,
    data: {
      ...data,
      status: "sent",
    },
    message: SUCCESS_MESSAGES.EMAIL_SENT,
    error: null,
  });
};

/**
 * Asynchronous Route Controller: Validates basic payload, queues email in background,
 * and immediately responds with 202 Accepted.
 */
const sendNotificationAsync = async (req, res) => {
  const body = req.body || {};
  const recipient = body.recipient || body.to;

  if (!recipient || typeof recipient !== "string" || !recipient.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: "INVALID_RECIPIENT",
        message: "Recipient email is required",
      },
    });
  }

  // Fire-and-forget in background
  setImmediate(() => {
    emailService.sendNotification(body).catch((err) => {
      console.error("[Async Notification Error]:", err.message);
    });
  });

  return res.status(202).json({
    success: true,
    data: {
      status: "queued",
      recipient,
      queuedAt: new Date().toISOString(),
    },
    message: SUCCESS_MESSAGES.EMAIL_QUEUED,
    error: null,
  });
};

module.exports = {
  sendNotification,
  sendNotificationSync,
  sendNotificationAsync,
};
