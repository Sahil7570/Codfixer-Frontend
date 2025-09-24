import React from "react";

const DownloadOptions = ({ image }) => {
  // If no image is provided, don't show anything
  if (!image) return null;

  // Function to handle download
  const downloadImage = (format) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `docfixer.${format}`;
    link.click();
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => downloadImage("jpeg")}>Download JPEG</button>
      <button onClick={() => downloadImage("png")}>Download PNG</button>
      <button onClick={() => downloadImage("pdf")}>Download PDF</button>
    </div>
  );
};

export default DownloadOptions;
