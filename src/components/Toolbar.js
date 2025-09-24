import React, { useState } from "react";
import axios from "axios";

const Toolbar = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData);
      // Send uploaded file URL to parent
      onFileUpload(response.data.url);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Upload
      </button>
    </div>
  );
};

export default Toolbar;
