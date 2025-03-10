// frontend/src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [fullUrl, setFullUrl] = useState("");
  const [customShortUrl, setCustomShortUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/shorten", {
        fullUrl,
        customShortUrl,
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error creating short URL");
    }
  };

  const refreshAnalytics = async () => {
    if (result && result.shortUrl) {
      try {
        // We'll use our analytics endpoint that returns all URL documents
        // and then filter for our specific shortUrl.
        const response = await axios.get("http://localhost:5000/api/analytics");
        const urlData = response.data.find(
          (url) => url.shortUrl === result.shortUrl
        );
        if (urlData) {
          setResult(urlData);
        }
      } catch (err) {
        console.error("Error refreshing analytics:", err);
      }
    }
  };



  return (
    <div className="App">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter Full URL"
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom Short URL (optional)"
          value={customShortUrl}
          onChange={(e) => setCustomShortUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <p>
            Short URL created:{" "}
            <a
              href={`http://localhost:5000/${result.shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              http://localhost:5000/{result.shortUrl}
            </a>
          </p>
          <p>Clicks: {result.clicks}</p>
          <button onClick={refreshAnalytics}>Refresh Click Count</button>
        </div>
      )}
    </div>
  );
}

export default App;
