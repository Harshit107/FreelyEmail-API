const { Queue } = require("bullmq");
const { getRedisConnection } = require("../config/redis");
const emailService = require("../services/email.service");

const QUEUE_NAME = "email-queue";
let emailQueue = null;

const getEmailQueue = () => {
  if (!emailQueue) {
    try {
      const connection = getRedisConnection();
      emailQueue = new Queue(QUEUE_NAME, {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });

      emailQueue.on("error", (err) => {
        // Quiet connection error if Redis isn't running locally
      });
    } catch (err) {
      console.warn("[BullMQ Init]: Redis unavailable, using background fallback.");
      emailQueue = null;
    }
  }
  return emailQueue;
};

/**
 * Add an email job to the BullMQ queue.
 * Gracefully falls back to direct asynchronous dispatch if Redis is down.
 *
 * @param {string} jobType - e.g. "notification" | "link" | "otp"
 * @param {Object} payload - Email request body
 * @param {Object} [options] - BullMQ job options
 * @returns {Promise<{ status: string, jobId?: string }>}
 */
const addEmailJob = async (jobType, payload, options = {}) => {
  try {
    const queue = getEmailQueue();
    if (queue) {
      const job = await queue.add(jobType, payload, options);
      return {
        status: "queued",
        jobId: job.id,
        queue: QUEUE_NAME,
      };
    }
  } catch (err) {
    // If Redis is unreachable, fallback to background setImmediate execution
  }

  // Graceful fallback when Redis is offline
  setImmediate(() => {
    let dispatchPromise;
    if (jobType === "link") {
      dispatchPromise = emailService.sendLinkVerification(payload);
    } else if (jobType === "otp") {
      dispatchPromise = emailService.sendOtp(payload);
    } else {
      dispatchPromise = emailService.sendNotification(payload);
    }

    dispatchPromise.catch((dispatchErr) => {
      console.error(`[Fallback Async ${jobType} Error]:`, dispatchErr.message);
    });
  });

  return {
    status: "queued",
    mode: "fallback-background",
  };
};

module.exports = {
  QUEUE_NAME,
  getEmailQueue,
  addEmailJob,
};
