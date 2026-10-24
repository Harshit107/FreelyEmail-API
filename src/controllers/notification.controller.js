const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");
const { validateRecipient } = require("./controller.helper");
const { addEmailJob } = require("../queues/email.queue");

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
 * Asynchronous Route Controller: Validates basic payload, pushes job to BullMQ queue,
 * and immediately responds with 202 Accepted.
 */
const sendNotificationAsync = async (req, res) => {
  const body = req.body || {};
  const recipient = body.recipient || body.to;

  // Reusable validation helper
  if (!validateRecipient(recipient, res)) {
    return;
  }

  // Enqueue job via BullMQ (with automatic background fallback)
  const queueResult = await addEmailJob("notification", body);

  return res.status(202).json({
    success: true,
    data: {
      ...queueResult,
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
