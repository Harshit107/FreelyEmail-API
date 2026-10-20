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

module.exports = {
  sendLinkVerification,
};
