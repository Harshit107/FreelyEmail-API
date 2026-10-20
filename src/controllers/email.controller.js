/**
 * Central Email Controller Aggregator
 * Re-exports modular controllers to maintain backward compatibility with routes.
 */

const { sendNotification } = require("./notification.controller");
const { sendOtp, requestOtp } = require("./otp.controller");
const { sendLinkVerification } = require("./verification.controller");
const { dispatchEmail } = require("../services/email.service");

module.exports = {
  sendNotification,
  sendOtp,
  requestOtp,
  sendLinkVerification,
  dispatchEmail,
};
