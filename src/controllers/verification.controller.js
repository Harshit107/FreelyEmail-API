const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");

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
 * Asynchronous Route Controller: Validates basic payload, queues email in background,
 * and immediately responds with 202 Accepted.
 */
const sendLinkAsync = async (req, res) => {
  const body = req.body || {};
  const recipient = body.recipient || body.to;
  const link = body.link;

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

  if (!link || typeof link !== "string" || !link.trim()) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: "INVALID_LINK",
        message: "Verification link is required",
      },
    });
  }

  // Fire-and-forget in background
  setImmediate(() => {
    emailService.sendLinkVerification(body).catch((err) => {
      console.error("[Async Link Verification Error]:", err.message);
    });
  });

  return res.status(202).json({
    success: true,
    data: {
      status: "queued",
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
