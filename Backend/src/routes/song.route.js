const express = require("express");
const upload = require("../Middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

const router = express.Router();

//upload a song
router.post("/", upload.single("song"), songController.uploadSong);

// Get all songs OR filter by mood
router.get("/", songController.getSong);
// Delete song
router.delete("/:id", songController.deleteSong);
router.patch("/:id/favourite", songController.toggleFavourite);

module.exports = router;
