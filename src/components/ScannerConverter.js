import React from "react";
import axios from "axios";

const ScannerConverter = ({ image, onUpdate }) => {
  // Apply scanner effect to the image
  const handleScanner = async () => {
    if (!image) return;

    try {
      // Convert image URL to Blob for upload
      const blob = await fetch(image).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("action", "scanner");

      const response = await axios.post("http://localhost:5000/api/upload", formData);

      // Send back the new scanned image URL
      onUpdate(response.data.url);
    } catch (err) {
      alert("Scanner effect failed: " + err.message);
    }
  };

  if (!image) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={handleScanner}>Apply Scanner Effect</button>
    </div>
  );
};

export default ScannerConverter;
