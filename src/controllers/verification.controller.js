const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");
const { validateRecipient, validateLink } = require("./controller.helper");
const { addEmailJob } = require("../queues/email.queue");

/**
 * Task Method & Route Controller for sending Link Verification Email.
 * - Called from routes: pass req.body or (req, res)
 * - Called directly from any module: sendLinkVerification(body)
 *
 * @param {Object} bodyOrReq
 * @param {Object} [res]
 * @returns {Promise<{ messageId: string }>}
 */
const sendLinkVerification = async (bodyOrReq, res) => {
  if (!res || typeof res.status !== "function") {
    const body = bodyOrReq && bodyOrReq.body ? bodyOrReq.body : bodyOrReq;
    return await emailService.sendLinkVerification(body);
  }

  const data = await emailService.sendLinkVerification(bodyOrReq.body);
  return res.status(200).json({
    success: true,
    data,
    message: SUCCESS_MESSAGES.LINK_SENT,
    error: null,
  });
};

/**
 * Synchronous Route Controller: Awaits delivery and returns messageId
 */
const sendLinkSync = async (req, res) => {
  const body = req.body || {};
  const data = await emailService.sendLinkVerification(body);
  return res.status(200).json({
    success: true,
    data: {
      ...data,
      status: "sent",
    },
    message: SUCCESS_MESSAGES.LINK_SENT,
    error: null,
  });
};

/**
 * Asynchronous Route Controller: Validates basic payload, pushes to BullMQ queue,
 * and immediately responds with 202 Accepted.
 */
const sendLinkAsync = async (req, res) => {
  const body = req.body || {};
  const recipient = body.recipient || body.to;
  const link = body.link;

  // Reusable validation helpers
  if (!validateRecipient(recipient, res)) {
    return;
  }

  if (!validateLink(link, res)) {
    return;
  }

  // Enqueue job via BullMQ (with automatic background fallback)
  const queueResult = await addEmailJob("link", body);

  return res.status(202).json({
    success: true,
    data: {
      ...queueResult,
      recipient,
      queuedAt: new Date().toISOString(),
    },
    message: SUCCESS_MESSAGES.LINK_QUEUED,
    error: null,
  });
};

module.exports = {
  sendLinkVerification,
  sendLinkSync,
  sendLinkAsync,
};
