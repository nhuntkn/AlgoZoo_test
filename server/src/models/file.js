const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  original_name: {
    type: String,
    required: true,
  },

  stored_name: {
    type: String,
    required: true,
  },

  mime_type: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("File", fileSchema);