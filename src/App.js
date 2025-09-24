import React, { useState, useRef } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Tesseract from "tesseract.js";
import { FaMagic, FaDownload, FaTextHeight, FaImage, FaFilePdf, FaFileImage, FaEyeDropper } from "react-icons/fa";
import "./styles/App.css";

function App() {
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [filter, setFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [compression, setCompression] = useState(100);
  const [addingText, setAddingText] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [placedTexts, setPlacedTexts] = useState([]);
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    uppercase: false,
    lowercase: false,
    color: "#ffffff",
    size: 20,
  });
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [activeTool, setActiveTool] = useState("");
  const imageRef = useRef(null);

  // File upload
  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded) return;
    resetState(uploaded);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped) return;
    resetState(dropped);
  };

  const resetState = (newFile) => {
    setFile(newFile);
    setImageURL(newFile.type === "application/pdf" ? null : URL.createObjectURL(newFile));
    setProcessedImage(null);
    setOcrText("");
    setPlacedTexts([]);
    setActiveTool(""); 
  };

  const handleDragOver = (e) => e.preventDefault();

  // OCR
  const handleOCR = async () => {
    if (!processedImage && !file) return alert("Upload an image for OCR");
    const target = processedImage || imageURL;
    if (!target) return alert("OCR works only on images");
    setLoadingOCR(true);
    Tesseract.recognize(target, "eng")
      .then(({ data: { text } }) => setOcrText(text))
      .finally(() => setLoadingOCR(false));
    setActiveTool("ocr");
  };

  // Background remover
  const handleRemoveBG = async () => {
    if (!file) return alert("Upload an image first");
    if (file.type.includes("pdf")) return alert("Works only with images");
    const formData = new FormData();
    formData.append("image_file", file);
    try {
      const res = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: { "X-Api-Key": "VSNXBaMjvgBp6NjjRheLV3cW" },
          responseType: "blob",
        }
      );
      setProcessedImage(URL.createObjectURL(res.data));
    } catch (err) {
      alert("Remove.bg API error: " + err.message);
    }
  };

  // Filters
  const getFilterStyle = () => {
    const i = Number(filterIntensity);
    switch (filter) {
      case "grayscale": return { filter: `grayscale(${i}%)` };
      case "sepia": return { filter: `sepia(${i}%)` };
      case "invert": return { filter: `invert(${i}%)` };
      case "blur": return { filter: `blur(${i / 20}px)` };
      case "brightness": return { filter: `brightness(${i}%)` };
      case "contrast": return { filter: `contrast(${i}%)` };
      case "saturate": return { filter: `saturate(${i}%)` };
      case "hue-rotate": return { filter: `hue-rotate(${i * 3.6}deg)` };
      default: return {};
    }
  };

  // Generate final image
  const generateFinalImage = () =>
    new Promise((resolve) => {
      const source = processedImage || imageURL;
      if (!source) return resolve(null);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.filter = getFilterStyle().filter || "none";
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", Number(compression) / 100));
      };
      img.src = source;
    });

  // Download
  const handleDownloadImage = async (format) => {
    const finalDataURL = await generateFinalImage();
    if (!finalDataURL) return;
    if (format === "pdf") {
      const doc = new jsPDF();
      doc.addImage(finalDataURL, "JPEG", 10, 10, 190, 0);
      doc.save("docfixer.pdf");
    } else {
      const link = document.createElement("a");
      link.href = finalDataURL;
      link.download = `docfixer.${format}`;
      link.click();
    }
  };

  // Text
  const handleAddText = () => {
    setAddingText(true);
    setActiveTool("text");
  };
  const handlePlaceText = () => {
    setPlacedTexts([...placedTexts, { ...currentText, ...textStyle, x: 50, y: 50 }]);
    setCurrentText("");
    setAddingText(false);
  };
  const handleDeleteText = () => {
    setCurrentText("");
    setAddingText(false);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button title="Background" onClick={handleRemoveBG}><FaImage /></button>
        <button title="Filters" onClick={() => setActiveTool(activeTool === "filter" ? "" : "filter")}><FaMagic /></button>
        <button title="Add Text" onClick={handleAddText}><FaTextHeight /></button>
        <button title="OCR" onClick={handleOCR}><FaEyeDropper /></button>
        {/* Download buttons always visible */}
        <button title="Download JPEG" onClick={() => handleDownloadImage("jpeg")}><FaFileImage /></button>
        <button title="Download PNG" onClick={() => handleDownloadImage("png")}><FaFileImage /></button>
        <button title="Download PDF" onClick={() => handleDownloadImage("pdf")}><FaFilePdf /></button>
      </div>

      {/* Editor */}
      <div className="editor">
        {!imageURL ? (
          <div
            className="upload-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p>Drag & Drop file(s) here or click to upload</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div className="preview-area">
            <div className="preview-left">
              <img src={processedImage || imageURL} alt="Preview" style={getFilterStyle()} ref={imageRef} />

              {addingText && (
                <div className="text-box">
                  <textarea
                    value={currentText.text || ""}
                    onChange={(e) => setCurrentText({ ...currentText, text: e.target.value })}
                    style={{
                      fontWeight: textStyle.bold ? "bold" : "normal",
                      fontStyle: textStyle.italic ? "italic" : "normal",
                      textDecoration: textStyle.underline ? "underline" : "none",
                      textTransform: textStyle.uppercase ? "uppercase" : textStyle.lowercase ? "lowercase" : "none",
                      color: textStyle.color,
                      fontSize: textStyle.size,
                    }}
                  />
                  <div className="text-box-buttons">
                    <button onClick={handlePlaceText}>✔</button>
                    <button onClick={handleDeleteText}>✖</button>
                  </div>
                </div>
              )}

              {placedTexts.map((t, idx) => (
                <div
                  key={idx}
                  className="placed-text"
                  style={{
                    left: t.x,
                    top: t.y,
                    fontWeight: t.bold ? "bold" : "normal",
                    fontStyle: t.italic ? "italic" : "normal",
                    textDecoration: t.underline ? "underline" : "none",
                    textTransform: t.uppercase ? "uppercase" : t.lowercase ? "lowercase" : "none",
                    color: t.color,
                    fontSize: t.size,
                  }}
                >
                  {t.text}
                </div>
              ))}
            </div>

            <div className="preview-right">
              {activeTool === "filter" && (
                <>
                  <h4>Filters</h4>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="none">None</option>
                    <option value="grayscale">Grayscale</option>
                    <option value="sepia">Sepia</option>
                    <option value="invert">Invert</option>
                    <option value="blur">Blur</option>
                    <option value="brightness">Brightness</option>
                    <option value="contrast">Contrast</option>
                    <option value="saturate">Saturate</option>
                    <option value="hue-rotate">Hue Rotate</option>
                  </select>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterIntensity}
                    onChange={(e) => setFilterIntensity(Number(e.target.value))}
                  />

                  <h4>Compression</h4>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={compression}
                    onChange={(e) => setCompression(Number(e.target.value))}
                  />
                  <span>{compression}%</span>
                </>
              )}

              {activeTool === "text" && (
                <>
                  <h4>Text Style</h4>
                  <button onClick={() => setTextStyle({ ...textStyle, bold: !textStyle.bold })}>Bold</button>
                  <button onClick={() => setTextStyle({ ...textStyle, italic: !textStyle.italic })}>Italic</button>
                  <button onClick={() => setTextStyle({ ...textStyle, underline: !textStyle.underline })}>Underline</button>
                  <button onClick={() => setTextStyle({ ...textStyle, uppercase: !textStyle.uppercase, lowercase: false })}>Uppercase</button>
                  <button onClick={() => setTextStyle({ ...textStyle, lowercase: !textStyle.lowercase, uppercase: false })}>Lowercase</button>
                  <input type="color" value={textStyle.color} onChange={(e) => setTextStyle({ ...textStyle, color: e.target.value })} />
                  <input type="number" value={textStyle.size} onChange={(e) => setTextStyle({ ...textStyle, size: Number(e.target.value) })} />
                </>
              )}

              {activeTool === "ocr" && (
                <>
                  <h4>OCR Output</h4>
                  <textarea value={ocrText} onChange={(e) => setOcrText(e.target.value)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
