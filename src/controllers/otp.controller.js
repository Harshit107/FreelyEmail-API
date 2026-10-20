const emailService = require("../services/email.service");
const { SUCCESS_MESSAGES } = require("../constants");

/**
 * Task Method & Route Controller for sending custom OTP email.
 * - Called from routes: pass req.body or (req, res)
 * - Called directly from any module: sendOtp(body)
 *
 * @param {Object} bodyOrReq
 * @param {Object} [res]
 * @returns {Promise<{ messageId: string }>}
 */
const sendOtp = async (bodyOrReq, res) => {
  if (!res || typeof res.status !== "function") {
    const body = bodyOrReq && bodyOrReq.body ? bodyOrReq.body : bodyOrReq;
    return await emailService.sendOtp(body);
  }

  const data = await emailService.sendOtp(bodyOrReq.body);
  return res.status(200).json({
    success: true,
    data,
    message: SUCCESS_MESSAGES.OTP_SENT,
    error: null,
  });
};

/**
 * Task Method & Route Controller for requesting auto-generated secure OTP email.
 * - Called from routes: pass req.body or (req, res)
 * - Called directly from any module: requestOtp(body)
 *
 * @param {Object} bodyOrReq
 * @param {Object} [res]
 * @returns {Promise<{ messageId: string, otp: string }>}
 */
const requestOtp = async (bodyOrReq, res) => {
  if (!res || typeof res.status !== "function") {
    const body = bodyOrReq && bodyOrReq.body ? bodyOrReq.body : bodyOrReq;
    return await emailService.requestOtp(body);
  }

  const data = await emailService.requestOtp(bodyOrReq.body);
  return res.status(200).json({
    success: true,
    data,
    message: SUCCESS_MESSAGES.OTP_REQUESTED,
    error: null,
  });
};

module.exports = {
  sendOtp,
  requestOtp,
};
