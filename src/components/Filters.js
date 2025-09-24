import React from "react";

const Filters = ({ image, onUpdate }) => {
  // Apply selected filter to the image
  const applyFilter = (filterType) => {
    if (!image) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      // Create canvas same size as image
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Set filter style
      switch (filterType) {
        case "grayscale":
          ctx.filter = "grayscale(1)";
          break;
        case "sepia":
          ctx.filter = "sepia(1)";
          break;
        default:
          ctx.filter = "none";
      }

      // Draw the filtered image on canvas
      ctx.drawImage(img, 0, 0);

      // Send new image back to parent
      onUpdate(canvas.toDataURL());
    };
  };

  if (!image) return null;

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => applyFilter("none")}>None</button>
      <button onClick={() => applyFilter("grayscale")}>Grayscale</button>
      <button onClick={() => applyFilter("sepia")}>Sepia</button>
    </div>
  );
};

export default Filters;
