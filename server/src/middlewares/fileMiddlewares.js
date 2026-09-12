const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const uploadDirectory = path.resolve(__dirname, "../../uploads/files");

// Create the upload directory if it doesn't exist
fs.mkdirSync(uploadDirectory, { recursive: true });

const ALLOWED_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        const subfolder = isImage ? "uploads/images" : "uploads/files";
        const fullPath = path.resolve(__dirname, "../../", subfolder);
        fs.mkdirSync(fullPath, { recursive: true }); // ensure it exists before writing
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

// File filter to validate file type and mimetype
const fileFilter = (req, file, cb) => {
    // get the file extension and check if it's allowed
    const ext = path.extname(file.originalname).toLowerCase();
    const expectedMime = ALLOWED_TYPES[ext];
    if (!expectedMime) {
        return cb(new Error("FILE_TYPE_NOT_ALLOWED"));
    }
    // Mimetype check: ensure the client-reported mimetype matches what we expect for that extension.
    if (file.mimetype !== expectedMime) {
        return cb(new Error("FILE_TYPE_MISMATCH"));
    }
    cb(null, true);
};

// Configure multer upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
});

module.exports = upload;


