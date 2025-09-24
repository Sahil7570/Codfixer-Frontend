import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRExtractor = () => {
  const [file, setFile] = useState(null);      // Uploaded file
  const [ocrText, setOcrText] = useState("");  // Extracted text
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setOcrText("");      // Clear previous text
    setLoading(true);    // Start loading

    // Run OCR
    Tesseract.recognize(selectedFile, "eng", {
      logger: (m) => console.log(m), // optional: log progress
    })
      .then((result) => {
        setOcrText(result.data.text);
      })
      .catch((err) => {
        alert("OCR failed: " + err.message);
      })
      .finally(() => setLoading(false)); // Stop loading
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Extracting text...</p>}
      {ocrText && (
        <textarea
          value={ocrText}
          readOnly
          rows={10}
          cols={50}
          style={{ marginTop: "10px", resize: "none" }}
        />
      )}
    </div>
  );
};

export default OCRExtractor;
