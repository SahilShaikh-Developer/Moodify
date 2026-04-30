const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ["Sad", "Happy", "Angry", "Surprise"],
    },
    audioUrl: {
      type: String,
      required: true,
    },
     coverUrl: {
     type: String,
     default: null,
   },
    duration: {
      type: Number,
      default: null,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Song", songSchema);
