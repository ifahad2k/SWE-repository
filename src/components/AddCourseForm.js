import { useState } from "react";
import { hexToRgb } from "../utils/helpers";
import { inputStyle, labelStyle, primaryButtonStyle, secondaryButtonStyle } from "../styles";

export default function AddCourseForm({ semesterNumber, semesterColor, onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [credit, setCredit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a course name");
      return;
    }
    onSubmit({
      name: name.trim(),
      code: code.trim() || null,
      credit: credit ? parseFloat(credit) : null,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#0a0f14",
          border: `1px solid ${semesterColor}`,
          borderRadius: "4px",
          padding: "32px",
          maxWidth: "460px",
          width: "100%",
          boxShadow: `0 0 60px rgba(${hexToRgb(semesterColor)}, 0.1)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: semesterColor, marginBottom: "8px", textTransform: "uppercase", fontWeight: "700" }}>
          Semester {semesterNumber}
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#ffffff", margin: "0 0 24px 0" }}>
          ➕ Add New Course
        </h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ ...labelStyle, color: semesterColor }}>Course Name *</label>
            <input type="text" placeholder="e.g., Software Engineering" value={name} onChange={(e) => setName(e.target.value)} style={{ ...inputStyle, borderColor: `rgba(${hexToRgb(semesterColor)}, 0.2)` }} autoFocus />
          </div>
          <div>
            <label style={{ ...labelStyle, color: semesterColor }}>Course Code</label>
            <input type="text" placeholder="e.g., CSE 4502" value={code} onChange={(e) => setCode(e.target.value)} style={{ ...inputStyle, borderColor: `rgba(${hexToRgb(semesterColor)}, 0.2)` }} />
          </div>
          <div>
            <label style={{ ...labelStyle, color: semesterColor }}>Credit Hours</label>
            <input type="number" step="0.5" min="0" max="10" placeholder="e.g., 3" value={credit} onChange={(e) => setCredit(e.target.value)} style={{ ...inputStyle, borderColor: `rgba(${hexToRgb(semesterColor)}, 0.2)` }} />
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button type="submit" style={{ ...primaryButtonStyle, background: semesterColor, flex: 1 }} onMouseEnter={(e) => { e.target.style.opacity = "0.8"; }} onMouseLeave={(e) => { e.target.style.opacity = "1"; }}>ADD COURSE</button>
            <button type="button" onClick={onCancel} style={secondaryButtonStyle} onMouseEnter={(e) => { e.target.style.color = "#fff"; e.target.style.borderColor = "#fff"; }} onMouseLeave={(e) => { e.target.style.color = "#8899aa"; e.target.style.borderColor = "#8899aa"; }}>CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}
