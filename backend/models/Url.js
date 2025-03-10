// backend/models/Url.js
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    fullUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
