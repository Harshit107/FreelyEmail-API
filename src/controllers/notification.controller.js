const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");

/**
 * Task Method & Route Controller for sending a notification email.
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

module.exports = {
  sendNotification,
};
