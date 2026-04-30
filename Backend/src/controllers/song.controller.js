const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");
const mm = require("music-metadata");

async function uploadSong(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Song file required" });
    }

    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    let tags = {};
    let duration = null;
    try {
      tags = id3.read(songBuffer);
      const metadata = await mm.parseBuffer(songBuffer, "audio/mpeg");
      duration = Math.round(metadata.format.duration);
    } catch (error) {
      tags = {};
      duration = null;
    }

    function cleanText(text) {
      if (!text) return null;
      return text
        .replace(/\([^)]*(?:kbps|320|128|192|256)[^)]*\)/gi, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/www\.[a-zA-Z0-9.-]+/gi, '')
        .replace(/https?:\/\/[^\s]*/gi, '')
        .replace(/downloadming[a-zA-Z0-9.]*/gi, '')
        .replace(/DownloadMing[a-zA-Z0-9.]*/g, '')
        .replace(/ghantalele[a-zA-Z0-9.]*/gi, '')
        .replace(/pagalworld[a-zA-Z0-9.]*/gi, '')
        .replace(/mr-jatt[a-zA-Z0-9.]*/gi, '')
        .replace(/songspk[a-zA-Z0-9.]*/gi, '')
        .replace(/riskyjatt[a-zA-Z0-9.]*/gi, '')
        .replace(/RiskyjaTT[a-zA-Z0-9.]*/g, '')
        .replace(/djpunjab[a-zA-Z0-9.]*/gi, '')
        .replace(/bestwap[a-zA-Z0-9.]*/gi, '')
        .replace(/[-–—]+\s*$/, '')
        .replace(/^\s*[-–—]+/, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    const rawTitle = tags.title || req.file.originalname.split(".")[0];
    const cleanedTitle = cleanText(rawTitle) || rawTitle;
    const cleanedArtist = cleanText(tags.artist) || "Unknown";

    const safeTitle = cleanedTitle
      .replace(/\s+/g, "-")
      .toLowerCase();

    const uploadPromises = [];

    uploadPromises.push(
      storageService.uploadFile({
        buffer: songBuffer,
        filename: `${safeTitle}.mp3`,
        folder: "/moodify/songs",
      })
    );

    if (
      tags.image &&
      tags.image.imageBuffer &&
      tags.image.imageBuffer.length < 1024 * 1024
    ) {
      uploadPromises.push(
        storageService.uploadFile({
          buffer: tags.image.imageBuffer,
          filename: `${safeTitle}.jpeg`,
          folder: "/moodify/posters",
        })
      );
    }

    let results;
    try {
      results = await Promise.all(uploadPromises);
    } catch (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return res.status(500).json({ message: uploadError.message });
    }

    const songFile = results[0];
    const posterFile = results[1] || null;

    const song = await songModel.create({
      title: cleanedTitle,
      artist: cleanedArtist,
      mood,
      audioUrl: songFile.url,
      coverUrl: posterFile ? posterFile.url : null,
      duration,
    });

    res.status(201).json({
      message: "Song created successfully",
      song,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Songs details
async function getSong(req, res) {
  try {
    const { mood } = req.query;
    const filter = mood ? { mood } : {};

    const song = await songModel.find(filter);
    res.status(200).json({
      message: "Song fetched successfully",
      song,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

//Delete songs
async function deleteSong(req, res) {
  try {
    const { id } = req.params;
    const song = await songModel.findByIdAndDelete(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function toggleFavourite(req, res) {
  try {
    const { id } = req.params;
    const song = await songModel.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    song.isFavourite = !song.isFavourite;
    await song.save();
    res.status(200).json({
      message: song.isFavourite ? "Added to favourites" : "Removed from favourites",
      song,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { uploadSong, getSong, deleteSong, toggleFavourite };
