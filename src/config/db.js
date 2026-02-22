const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL_PROD || process.env.MONGO_URL || process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!MONGO_URL) {
      throw new Error("MongoDB Connection URI is missing. Ensure MONGO_URL_PROD or MONGO_URI is set in your .env or Environment Variables.");
    }
    
    // Removing deprecated options if upgrading to mongoose@latest (v7+ doesn't need them, but it's safe to omit)
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
