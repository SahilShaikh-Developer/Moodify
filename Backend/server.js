require("dotenv").config();
const app = require("./src/app");
const ConnectToDB = require("./src/config/database");
const { connectRedis } = require("./src/config/redis");
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    //Connecting to Database
    await ConnectToDB();
    console.log("MongoDB Connected");

    //Connecting to Redis
    await connectRedis();

    //Starting the server
    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1); // Exit the process with an error code
  }
}

startServer()
