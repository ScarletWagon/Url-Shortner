// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount API routes under /api
const apiRoutes = require("./routes/urlApiRoutes");
app.use("/api", apiRoutes);

// Redirection route: when visiting http://localhost:5000/<shortUrl>
const Url = require("./models/Url");
app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if (!url) {
      return res.status(404).send("URL not found");
    }
    // Increment click count
    url.clicks++;
    await url.save();
    // Redirect to the original URL
    res.redirect(url.fullUrl);
  } catch (error) {
    console.error("Redirection error:", error);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
