const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL_PROD;
    // Removing deprecated options if upgrading to mongoose@latest (v7+ doesn't need them, but it's safe to omit)
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
