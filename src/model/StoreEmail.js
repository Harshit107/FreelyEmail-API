const mongoose = require("mongoose");

const storeEmailSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const emailStore = mongoose.model("Store", storeEmailSchema);
module.exports = emailStore;
