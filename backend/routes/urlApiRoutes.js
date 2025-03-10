// backend/routes/urlApiRoutes.js
const express = require("express");
const router = express.Router();
const Url = require("../models/Url");

// Helper function to generate a random 6-character short URL
const generateShortUrl = () => {
  return Math.random().toString(36).substr(2, 6);
};

// POST /api/shorten - Create a new short URL
router.post("/shorten", async (req, res) => {
  try {
    const { fullUrl, customShortUrl } = req.body;
    if (!fullUrl) {
      return res.status(400).json({ error: "Full URL is required" });
    }
    // Use the custom short URL if provided; otherwise, generate one
    const shortUrl = customShortUrl ? customShortUrl : generateShortUrl();

    // Check if the chosen short URL is already taken
    const existing = await Url.findOne({ shortUrl });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Short URL already in use, please choose another" });
    }

    const url = new Url({ fullUrl, shortUrl });
    await url.save();
    res.json(url);
  } catch (error) {
    console.error("Error in /api/shorten:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics - Get analytics for all shortened URLs
router.get("/analytics", async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    console.error("Error in /api/analytics:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
