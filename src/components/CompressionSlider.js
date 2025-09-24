import React, { useState } from "react";
import axios from "axios";

const CompressionSlider = ({ image, onUpdate }) => {
  const [quality, setQuality] = useState(100); // Slider value
  const [loading, setLoading] = useState(false);

  const handleCompress = async () => {
    if (!image) return alert("Upload an image first!");
    setLoading(true);
    try {
      // Convert image URL to Blob
      const blob = await fetch(image).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("compressLevel", quality);

      const res = await axios.post("http://localhost:5000/api/upload", formData);
      onUpdate(res.data.url); // Update image URL in parent
    } catch (err) {
      alert("Compression failed: " + err.message);
    }
    setLoading(false);
  };

  if (!image) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <label>
        Compression: {quality}%
        <input
          type="range"
          min="10"
          max="100"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          style={{ width: "100%" }}
        />
      </label>
      <button onClick={handleCompress} disabled={loading} style={{ marginTop: "5px" }}>
        {loading ? "Compressing..." : "Compress"}
      </button>
    </div>
  );
};

export default CompressionSlider;
