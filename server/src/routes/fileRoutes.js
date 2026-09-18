const express = require("express");
const multer = require("multer");

const upload = require("../middlewares/fileMiddlewares");
const { isAuthenticatedUser } = require("../middlewares/authMiddleware");
const { uploadFile, getFile } = require("../controllers/fileController");

const router = express.Router();

router.get("/:id", isAuthenticatedUser, getFile);

router.post(
  "/",
  isAuthenticatedUser,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({status: "error", message: "File size exceeds the limit of 10MB" });
      }
      if (err) {
        return res.status(400).json({status: "error", message: err.message });
      }
      next();
    });
  },
  uploadFile
);

module.exports = router;

