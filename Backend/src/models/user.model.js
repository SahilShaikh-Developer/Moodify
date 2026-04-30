const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // required: true,
      trim: true,
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      lowercase: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      select: false,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null for local users
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
