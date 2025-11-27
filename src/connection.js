// const mongoose = require('mongoose');
// mongoose.set("strictQuery", true);

// async function connectMongoDB(url) {
//     return mongoose.connect(url)
// }

// module.exports = {connectMongoDB};

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectMongoDB() {
  try {
    const dbUrl = process.env.MONGO_URL;

    if (!dbUrl) {
      console.error(" MONGO_URL is missing in .env file");
      return;
    }

    await mongoose.connect(dbUrl);

    console.log(" MongoDB Atlas Connected Successfully!");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectMongoDB;

