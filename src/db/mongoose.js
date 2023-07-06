const mongoose = require("mongoose");
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
  try {
    mongoose
      .connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then( ( ) => '')
      .catch((err) => console.log("MongoDb error: " + err));
  } catch (err) {
    console.error(err);
    process.exit(1);

};
