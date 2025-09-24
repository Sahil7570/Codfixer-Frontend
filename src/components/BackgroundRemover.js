import React from "react";
import axios from "axios";

// Props:
// - image: the image URL to process
// - onUpdate: callback to update the image after BG removal
const BackgroundRemover = ({ image, onUpdate }) => {
  // Function to call backend API to remove background
  const handleRemoveBg = async () => {
    if (!image) return alert("No image to process");

    try {
      // Convert image URL to Blob
      const blob = await fetch(image).then((res) => res.blob());

      // Prepare form data
      const formData = new FormData();
      formData.append("file", blob);       // file to send
      formData.append("action", "removeBg"); // tell backend to remove background

      // Send request to backend
      const res = await axios.post("http://localhost:5000/api/upload", formData);

      // Update parent component with new image URL
      onUpdate(res.data.url);
    } catch (err) {
      alert("Error removing background: " + err.message);
      console.error(err);
    }
  };

  // If no image, don’t show button
  if (!image) return null;

  return (
    <button onClick={handleRemoveBg}>
      Remove Background
    </button>
  );
};

export default BackgroundRemover;
