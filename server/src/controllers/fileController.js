/*
Handle file upload and storage in the database.
*/

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const File = require("../models/file");

const getFile = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ status: "error", message: "Invalid file id" });
        }
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ status: "error", message: "File not found" });
        }
        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ status: "error", message: "File no longer exists on server" });
        }
        res.setHeader("Content-Type", file.mime_type);
        return res.sendFile(path.resolve(file.path));
    } catch (error) {
        console.error("Error while retrieving file:", error);
        return res.status(500).json({ status: "error", message: "Failed to retrieve file" });
    }
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "error", message: "No file uploaded" });
    }
    try {
        const file = await File.create({
            original_name: req.file.originalname,
            stored_name: req.file.filename,
            mime_type: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            uploaded_by: req.user._id,
        });
        return res.status(201).json({
                status: "success",
                message: "File uploaded successfully",
                data: {
                file_id: file._id,
                filename: file.original_name
                }
        });

    }
    catch (error) {
        console.error("Database error while saving file:", error);

        // Delete the uploaded file from the filesystem if the database operation fails
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Failed to clean up orphaned file:", unlinkErr);
            }  
        });       

        return res.status(500).json({ status: "error", message: "File upload failed" });
    }
};

module.exports = {
    uploadFile,
    getFile,
};