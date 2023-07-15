const mongoose = require("mongoose");

const emailStoreSchema = new mongoose.Schema({
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    app: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const emailStore = mongoose.model("Store",emailStoreSchema);
module.exports = emailStore;
