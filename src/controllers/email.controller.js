/**
 * Central Email Controller Aggregator
 * Re-exports modular controllers to maintain backward compatibility with routes.
 */

const {
  sendNotification,
  sendNotificationSync,
  sendNotificationAsync,
} = require("./notification.controller");
const { sendOtp, requestOtp } = require("./otp.controller");
const {
  sendLinkVerification,
  sendLinkSync,
  sendLinkAsync,
} = require("./verification.controller");
const { dispatchEmail } = require("../services/email.service");

module.exports = {
  sendNotification,
  sendNotificationSync,
  sendNotificationAsync,
  sendOtp,
  requestOtp,
  sendLinkVerification,
  sendLinkSync,
  sendLinkAsync,
  dispatchEmail,
};
