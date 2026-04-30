const mongoose = require("mongoose");

async function ConnectToDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Database");
}

module.exports = ConnectToDB;
