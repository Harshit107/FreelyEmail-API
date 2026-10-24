const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    recipient: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    replyTo: {
      type: String,
      trim: true,
    },
    messageId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    app: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["notification", "otp", "link"],
      default: "notification",
    },
    status: {
      type: String,
      enum: ["queued", "dispatched", "completed", "failed"],
      default: "dispatched",
    },
    jobId: {
      type: String,
      trim: true,
      index: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Retain logs for 90 days to prevent unbounded DB size (TTL index)
emailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
emailSchema.index({ createdAt: -1 });

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
