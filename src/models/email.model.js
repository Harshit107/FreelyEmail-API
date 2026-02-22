const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    replyTo: {
      type: String,
    },
    messageId: {
      type: String,
      required: true,
    },
    app: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["notification", "otp", "link"],
      default: "notification",
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
