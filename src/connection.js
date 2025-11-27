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
    const dbUrl = process.env.MONGO_URL;  // env से लेगा
    if (!dbUrl) {
      console.error(" MONGO_URL is missing in environment variables");
      return;
    }

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(" MongoDB Connected!");
  } catch (err) {
    console.error(" MongoDB Connection Error:", err);
    process.exit(1);
  }
}

module.exports = connectMongoDB;
