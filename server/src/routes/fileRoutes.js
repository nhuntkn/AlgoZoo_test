const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const File = require("../models/file");
const { isAuthenticatedUser } = require("../middlewares/authMiddleware");

const router = express.Router();
const uploadDirectory = path.resolve(__dirname, "../../uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/", isAuthenticatedUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = await File.create({
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      mime_type: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploaded_by: req.user._id,
    });

    res.status(201).json({
      file_id: file._id,
      filename: file.original_name,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "File upload failed",
    });
  }
});

module.exports = router;