const { Worker } = require("bullmq");
const { getRedisConnection } = require("../config/redis");
const { QUEUE_NAME } = require("../queues/email.queue");
const emailService = require("../services/email.service");
const Email = require("../models/email.model");

let emailWorker = null;

/**
 * Process individual email job by type
 * @param {import("bullmq").Job} job
 */
const processEmailJob = async (job) => {
  const { name, data } = job;
  console.log(`[Worker] Processing job #${job.id} (${name}) for ${data.recipient || data.to}`);

  switch (name) {
    case "notification":
      return await emailService.sendNotification(data);

    case "link":
      return await emailService.sendLinkVerification(data);

    case "otp":
      return await emailService.sendOtp(data);

    default:
      console.warn(`[Worker] Unknown job type: ${name}, defaulting to notification`);
      return await emailService.sendNotification(data);
  }
};

/**
 * Handles job completion: logs outcome and updates database document
 * @param {import("bullmq").Job} job
 * @param {Object} [result]
 */
const handleJobCompleted = async (job, result) => {
  console.log(`[Worker] Job #${job.id} completed successfully. MessageId: ${result?.messageId || "N/A"}`);

  try {
    if (result?.messageId) {
      await Email.findOneAndUpdate(
        { messageId: result.messageId },
        {
          $set: {
            jobId: String(job.id),
            status: "completed",
            completedAt: new Date(),
          },
        }
      );
    }
  } catch (dbErr) {
    console.error(`[Worker DB Error] Failed to update completed job #${job.id}:`, dbErr.message);
  }
};

/**
 * Handles job failure: logs error and marks status as failed in database
 * @param {import("bullmq").Job} job
 * @param {Error} err
 */
const handleJobFailed = async (job, err) => {
  console.error(`[Worker] Job #${job?.id} failed with error:`, err.message);

  try {
    if (job?.id) {
      await Email.findOneAndUpdate(
        { jobId: String(job.id) },
        { $set: { status: "failed" } }
      );
    }
  } catch (dbErr) {
    console.error(`[Worker DB Error] Failed to record failure for job #${job?.id}:`, dbErr.message);
  }
};

/**
 * Start BullMQ consumer worker
 */
const startEmailWorker = () => {
  if (emailWorker) {
    return emailWorker;
  }

  try {
    const connection = getRedisConnection();
    emailWorker = new Worker(QUEUE_NAME, processEmailJob, {
      connection,
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5", 10),
    });

    emailWorker.on("completed", handleJobCompleted);
    emailWorker.on("failed", handleJobFailed);

    emailWorker.on("error", (err) => {
      // Quiet connection error if local Redis isn't running
    });

    console.log(`[Worker] Email consumer worker started on queue: ${QUEUE_NAME}`);
  } catch (err) {
    console.warn("[Worker Init]: Failed to initialize BullMQ worker:", err.message);
    emailWorker = null;
  }

  return emailWorker;
};

// If run directly via node src/workers/email.worker.js
if (require.main === module) {
  startEmailWorker();
}

module.exports = {
  startEmailWorker,
  processEmailJob,
  handleJobCompleted,
  handleJobFailed,
};
