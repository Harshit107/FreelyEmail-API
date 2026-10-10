const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri =
    process.env.MONGO_URL ||
    process.env.MONGO_URL_PROD ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Error: MongoDB connection string is missing in environment variables (.env).");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB initial connection failed:", err.message);
    process.exit(1);
  }

  // Handle connection events after initial connection
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB runtime error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB connection disconnected");
  });
};

module.exports = connectDB;
