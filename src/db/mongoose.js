const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL_PROD;
  try {
    mongoose
      .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then( ( ) => console.log("Connected"))
      .catch((err) => console.log("MongoDb error: " + err));
  } catch (err) {
    console.error(err);
    process.exit(1);

};
