const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
   fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only MP3 files allowed"), false);
    }
  },
});

module.exports = upload;
