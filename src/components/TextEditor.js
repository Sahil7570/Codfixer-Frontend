import React, { useState } from "react";
import { Rnd } from "react-rnd";

// Default text style
const defaultTextStyle = {
  fontSize: 24,
  color: "#000000",
  bold: false,
  italic: false,
  underline: false,
  upper: false,
  lower: false,
  fontFamily: "Arial",
};

// Unique ID generator
let idCounter = 0;

const TextEditor = ({ onUpdate }) => {
  const [textBoxes, setTextBoxes] = useState([]);
  const [newText, setNewText] = useState("");

  // Add a new text box
  const addTextBox = () => {
    if (!newText) return;
    const box = {
      id: idCounter++,
      text: newText,
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      ...defaultTextStyle,
    };
    setTextBoxes([...textBoxes, box]);
    setNewText("");
    onUpdate([...textBoxes, box]); // notify parent
  };

  // Update an existing text box
  const updateBox = (id, updates) => {
    const newBoxes = textBoxes.map((tb) =>
      tb.id === id ? { ...tb, ...updates } : tb
    );
    setTextBoxes(newBoxes);
    onUpdate(newBoxes.find(tb => tb.id === id));
  };

  // Delete a text box
  const deleteBox = (id) => {
    const newBoxes = textBoxes.filter((tb) => tb.id !== id);
    setTextBoxes(newBoxes);
    onUpdate(newBoxes);
  };

  return (
    <div>
      {/* Input for new text */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          style={{ width: "60%" }}
        />
        <button onClick={addTextBox} style={{ marginLeft: "5px" }}>
          Add Text
        </button>
      </div>

      {/* Render all text boxes */}
      {textBoxes.map((tb) => (
        <Rnd
          key={tb.id}
          size={{ width: tb.width, height: tb.height }}
          position={{ x: tb.x, y: tb.y }}
          onDragStop={(e, d) => updateBox(tb.id, { x: d.x, y: d.y })}
          onResizeStop={(e, direction, ref, delta, position) =>
            updateBox(tb.id, {
              width: parseInt(ref.style.width),
              height: parseInt(ref.style.height),
              ...position,
            })
          }
          bounds="parent"
        >
          <div
            style={{
              position: "relative",
              border: "1px dashed #aaa",
              padding: "2px",
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          >
            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: "5px",
                marginBottom: "2px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => updateBox(tb.id, { bold: !tb.bold })}
                style={{ fontWeight: tb.bold ? "bold" : "normal" }}
              >
                B
              </button>
              <button
                onClick={() => updateBox(tb.id, { italic: !tb.italic })}
                style={{ fontStyle: tb.italic ? "italic" : "normal" }}
              >
                I
              </button>
              <button
                onClick={() =>
                  updateBox(tb.id, { underline: !tb.underline })
                }
                style={{
                  textDecoration: tb.underline ? "underline" : "none",
                }}
              >
                U
              </button>
              <button
                onClick={() => updateBox(tb.id, { upper: !tb.upper, lower: false })}
              >
                Upper
              </button>
              <button
                onClick={() => updateBox(tb.id, { lower: !tb.lower, upper: false })}
              >
                Lower
              </button>
              <input
                type="number"
                value={tb.fontSize}
                onChange={(e) =>
                  updateBox(tb.id, { fontSize: parseInt(e.target.value) })
                }
                style={{ width: "50px" }}
              />
              <select
                value={tb.fontFamily}
                onChange={(e) => updateBox(tb.id, { fontFamily: e.target.value })}
              >
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Verdana</option>
                <option>Courier New</option>
              </select>
              <input
                type="color"
                value={tb.color}
                onChange={(e) => updateBox(tb.id, { color: e.target.value })}
              />
              <button
                onClick={() => deleteBox(tb.id)}
                style={{ color: "red" }}
              >
                ✖
              </button>
            </div>

            {/* Text Display */}
            <div
              style={{
                fontSize: tb.fontSize,
                color: tb.color,
                fontWeight: tb.bold ? "bold" : "normal",
                fontStyle: tb.italic ? "italic" : "normal",
                textDecoration: tb.underline ? "underline" : "none",
                fontFamily: tb.fontFamily,
                userSelect: "none",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {tb.upper
                ? tb.text.toUpperCase()
                : tb.lower
                ? tb.text.toLowerCase()
                : tb.text}
            </div>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default TextEditor;
