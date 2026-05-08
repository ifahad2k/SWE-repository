/**
 * Shared inline styles and constants for SWE Repository.
 * Follows the same dark, monospace, hacker-aesthetic as the cybersec-roadmap.
 */

export const SEMESTER_COLORS = [
  "#00ff88", // Semester 1 — green
  "#00ccff", // Semester 2 — cyan
  "#ff8800", // Semester 3 — orange
  "#cc00ff", // Semester 4 — purple
  "#ff0044", // Semester 5 — red
  "#ffdd00", // Semester 6 — gold
  "#ff4488", // Semester 7 — pink
  "#44ff88", // Semester 8 — lime
];

export const SEMESTER_ICONS = ["📗", "📘", "📙", "📕", "🔴", "🟡", "🩷", "🟢"];

export const SECTION_ICONS = {
  Lecture: "🎓",
  Books: "📚",
  "Previous Year Questions": "📝",
  Notes: "📋",
};

export const SECTION_COLORS = {
  Lecture: "#00ccff",
  Books: "#ff8800",
  "Previous Year Questions": "#ff0044",
  Notes: "#cc00ff",
};

export const DEFAULT_SECTIONS = ["Lecture", "Books", "Previous Year Questions", "Notes"];

export const pageBackground = {
  background: "#030508",
  minHeight: "100vh",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  color: "#c8d8e8",
  position: "relative",
  overflowX: "hidden",
};

export const gridOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundImage: `
    linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",
  pointerEvents: "none",
  zIndex: 0,
};

export const glowOrb1 = {
  position: "fixed", top: "-200px", left: "-200px",
  width: "600px", height: "600px", borderRadius: "50%",
  background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)",
  pointerEvents: "none", zIndex: 0,
};

export const glowOrb2 = {
  position: "fixed", bottom: "-200px", right: "-200px",
  width: "600px", height: "600px", borderRadius: "50%",
  background: "radial-gradient(circle, rgba(204,0,255,0.04) 0%, transparent 70%)",
  pointerEvents: "none", zIndex: 0,
};

export const contentContainer = {
  position: "relative",
  zIndex: 1,
  maxWidth: "900px",
  margin: "0 auto",
  padding: "40px 20px",
};

export const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "4px",
  padding: "16px 18px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(0,255,136,0.2)",
  borderRadius: "3px",
  color: "#ccd8e4",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  fontSize: "12px",
  boxSizing: "border-box",
  outline: "none",
};

export const labelStyle = {
  display: "block",
  fontSize: "11px",
  letterSpacing: "1px",
  color: "#00ff88",
  marginBottom: "6px",
  textTransform: "uppercase",
};

export const primaryButtonStyle = {
  background: "#00ff88",
  color: "#000000",
  padding: "10px 16px",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  fontWeight: "700",
  letterSpacing: "1px",
  border: "none",
  transition: "all 0.2s",
};

export const secondaryButtonStyle = {
  background: "transparent",
  color: "#8899aa",
  padding: "10px 16px",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  fontWeight: "700",
  border: "1px solid #8899aa",
  transition: "all 0.2s",
};

export const backButtonStyle = {
  background: "none",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#8899aa",
  padding: "8px 18px",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "12px",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  letterSpacing: "1px",
  transition: "all 0.2s",
};

export const deleteButtonStyle = {
  background: "rgba(255,0,0,0.2)",
  border: "1px solid rgba(255,0,0,0.5)",
  color: "#ff4444",
  padding: "4px 8px",
  borderRadius: "2px",
  cursor: "pointer",
  fontSize: "10px",
  fontFamily: "'Courier New', 'Lucida Console', monospace",
  transition: "all 0.2s",
};
