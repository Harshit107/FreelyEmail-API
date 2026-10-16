/**
 * Central Logger Client Service
 * Dispatches non-blocking telemetry and user-data logs to the Central Logging Service (Port 5001)
 */

const { ECOSYSTEM_URLS } = require('../constants');

const getServiceConfig = () => {
  let baseUrl = process.env.LOGGING_SERVICE_URL;
  // Fall back to central logger API domain if not configured or pointing to localhost in production
  if (!baseUrl || (process.env.NODE_ENV === 'production' && baseUrl.includes('localhost'))) {
    baseUrl = ECOSYSTEM_URLS.LOGGER_API;
  }
  const apiKey =
    process.env.LOGGING_SERVICE_API_KEY ||
    process.env.PRIVATE_API_KEY ||
    '50b65cea-691b-406e-9d28-0718b86abe98';
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
};


/**
 * Sends a log entry to the central logging service with timeout and fail-safe error suppression
 */
const sendToCentralLogging = async (endpoint, payload) => {
  try {
    const { baseUrl, apiKey } = getServiceConfig();
    if (!apiKey) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-logging-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (err) {
    // Fail-safe: Central logging failure should NEVER crash or block email operations
    return null;
  }
};

/**
 * Log user-data audit trail (e.g. email notifications, OTPs, verification links)
 */
const logUserData = async ({
  messageId,
  sender,
  recipient,
  replyTo,
  app = 'FreelyEmail-API',
  subject,
  type = 'notification',
  status = 'dispatched',
  metadata = {},
}) => {
  return sendToCentralLogging('/api/v1/logs/user-data', {
    messageId,
    sender,
    recipient,
    replyTo,
    app,
    subject,
    type,
    status,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log application errors, exceptions, and SMTP connection failures
 */
const logError = async ({
  serviceName = 'FreelyEmail-API',
  environment = process.env.NODE_ENV || 'development',
  level = 'error',
  message,
  errorCode,
  stackTrace,
  correlationId,
  metadata = {},
}) => {
  return sendToCentralLogging('/api/v1/logs/errors', {
    serviceName,
    environment,
    level,
    message,
    errorCode,
    stackTrace,
    correlationId,
    metadata,
  });
};

/**
 * Log operational events and lifecycle checkpoints
 */
const logInfo = async ({
  serviceName = 'FreelyEmail-API',
  environment = process.env.NODE_ENV || 'development',
  level = 'info',
  eventName,
  message,
  correlationId,
  metadata = {},
}) => {
  return sendToCentralLogging('/api/v1/logs/info', {
    serviceName,
    environment,
    level,
    eventName,
    message,
    correlationId,
    metadata,
  });
};

module.exports = {
  logUserData,
  logError,
  logInfo,
};
