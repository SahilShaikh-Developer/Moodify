const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  }),
);
app.use(express.static("./public"));
app.use(cookieParser());

/**Routes */
const authRoute = require("./routes/auth.route");
const songRoute = require("./routes/song.route");

app.use("/api/auth", authRoute);
app.use("/api/song", songRoute);

/**Universal method */
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});

module.exports = app;
