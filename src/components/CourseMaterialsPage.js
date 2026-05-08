import { useState } from "react";
import { hexToRgb, validateLink, generateId } from "../utils/helpers";
import {
  SECTION_ICONS,
  SECTION_COLORS,
  cardStyle,
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  backButtonStyle,
  deleteButtonStyle,
} from "../styles";

export default function CourseMaterialsPage({
  course,
  semester,
  semesterColor,
  user,
  onBack,
  onAddMaterial,
  onDeleteMaterial,
  onAddSection,
  onDeleteSection,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [newSectionName, setNewSectionName] = useState("");
  const [showSectionForm, setShowSectionForm] = useState(false);

  const sections = course.sections || [];

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      alert("Please fill in both title and URL");
      return;
    }
    if (!validateLink(formData.url)) {
      alert("Please enter a valid URL (starting with https:// or http://)");
      return;
    }
    if (!selectedSection) {
      alert("Please select a section");
      return;
    }
    onAddMaterial(selectedSection, {
      id: generateId(),
      title: formData.title.trim(),
      url: formData.url.trim(),
    });
    setFormData({ title: "", url: "" });
    setShowAddForm(false);
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) {
      alert("Please enter a section name");
      return;
    }
    // Check for duplicates
    if (sections.find((s) => s.name.toLowerCase() === newSectionName.trim().toLowerCase())) {
      alert("A section with this name already exists");
      return;
    }
    onAddSection({
      id: generateId(),
      name: newSectionName.trim(),
      type: "custom",
      materials: [],
    });
    setNewSectionName("");
    setShowSectionForm(false);
  };

  const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div
      style={{
        background: "#030508",
        minHeight: "100vh",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        color: "#c8d8e8",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(${hexToRgb(semesterColor)},0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(${hexToRgb(semesterColor)},0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Glow orbs */}
      <div style={{ position: "fixed", top: "-200px", left: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(${hexToRgb(semesterColor)},0.04) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(204,0,255,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Back Button */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={onBack}
            style={backButtonStyle}
            onMouseEnter={(e) => { e.target.style.borderColor = semesterColor; e.target.style.color = semesterColor; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "#8899aa"; }}
          >
            ← BACK TO SEMESTERS
          </button>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "2px",
                padding: "3px 10px",
                border: `1px solid ${semesterColor}`,
                color: semesterColor,
                borderRadius: "2px",
                fontWeight: "700",
                background: `rgba(${hexToRgb(semesterColor)}, 0.1)`,
              }}
            >
              SEMESTER {semester.number}
            </span>
            {course.code && (
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "2px",
                  padding: "3px 10px",
                  border: "1px solid #667788",
                  color: "#8899aa",
                  borderRadius: "2px",
                  fontWeight: "700",
                }}
              >
                {course.code}
              </span>
            )}
            {course.credit && (
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "2px",
                  padding: "3px 10px",
                  border: "1px solid #334455",
                  color: "#556677",
                  borderRadius: "2px",
                }}
              >
                {course.credit} CREDITS
              </span>
            )}
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "900",
              color: "#fff",
              margin: "0 0 8px 0",
              letterSpacing: "-0.5px",
            }}
          >
            📚 {course.name}
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "#556677",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Course Materials
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, sIdx) => {
          const sectionIcon = SECTION_ICONS[section.name] || "📎";
          const sectionColor = SECTION_COLORS[section.name] || semesterColor;
          const materialCount = section.materials ? section.materials.length : 0;

          return (
            <div key={section.id || sIdx} style={{ marginBottom: "32px" }}>
              {/* Section header */}
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: sectionColor,
                  marginBottom: "14px",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "16px" }}>{sectionIcon}</span>
                {section.name} ({materialCount})
                {section.type === "custom" && (
                  <span
                    style={{
                      fontSize: "8px",
                      color: "#445566",
                      border: "1px solid #334455",
                      padding: "1px 6px",
                      borderRadius: "2px",
                    }}
                  >
                    CUSTOM
                  </span>
                )}
                {/* Delete custom section button (auth only) */}
                {user && section.type === "custom" && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete section "${section.name}" and all its materials?`)) {
                        onDeleteSection(section.id);
                      }
                    }}
                    style={{
                      ...deleteButtonStyle,
                      marginLeft: "auto",
                      fontSize: "8px",
                      padding: "2px 6px",
                    }}
                    onMouseEnter={(e) => { e.target.style.background = "rgba(255,0,0,0.4)"; }}
                    onMouseLeave={(e) => { e.target.style.background = "rgba(255,0,0,0.2)"; }}
                  >
                    ✖ REMOVE SECTION
                  </button>
                )}
              </div>

              {/* Material cards */}
              {materialCount > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {section.materials.map((material, mIdx) => (
                    <div key={material.id || mIdx} style={{ position: "relative" }}>
                      <div
                        onClick={() => openLink(material.url)}
                        style={{ ...cardStyle }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = sectionColor;
                          e.currentTarget.style.background = `rgba(${hexToRgb(sectionColor)}, 0.06)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "4px",
                            background: `rgba(${hexToRgb(sectionColor)}, 0.1)`,
                            border: `1px solid rgba(${hexToRgb(sectionColor)}, 0.2)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            flexShrink: 0,
                          }}
                        >
                          🔗
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#ccd8e4",
                              fontWeight: "600",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {material.title}
                          </div>
                          <div style={{ fontSize: "10px", color: "#556677", marginTop: "2px" }}>
                            Drive Link
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            letterSpacing: "2px",
                            color: sectionColor,
                            border: `1px solid ${sectionColor}`,
                            padding: "4px 12px",
                            borderRadius: "2px",
                            fontWeight: "700",
                            flexShrink: 0,
                            cursor: "pointer",
                          }}
                        >
                          OPEN
                        </div>
                      </div>
                      {user && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete material "${material.title}"?`)) {
                              onDeleteMaterial(section.id, material.id);
                            }
                          }}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            ...deleteButtonStyle,
                          }}
                          onMouseEnter={(e) => { e.target.style.background = "rgba(255,0,0,0.4)"; }}
                          onMouseLeave={(e) => { e.target.style.background = "rgba(255,0,0,0.2)"; }}
                        >
                          DELETE
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <div style={{ fontSize: "20px", marginBottom: "8px", opacity: 0.4 }}>
                    {sectionIcon}
                  </div>
                  <div style={{ fontSize: "12px", color: "#445566", letterSpacing: "1px" }}>
                    No materials yet
                  </div>
                  {user && (
                    <div style={{ fontSize: "10px", color: "#334455", marginTop: "4px" }}>
                      Add drive links below
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Material Form — auth only */}
        {user && (
          <div
            style={{
              marginTop: "40px",
              padding: "20px",
              border: "1px solid rgba(0,255,136,0.3)",
              borderRadius: "4px",
              background: "rgba(0,255,136,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#00ff88",
                marginBottom: "16px",
                textTransform: "uppercase",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>➕</span> Add New Material
            </div>

            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  background: "rgba(0,255,136,0.1)",
                  border: "1px solid #00ff88",
                  color: "#00ff88",
                  padding: "10px 20px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(0,255,136,0.2)"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(0,255,136,0.1)"; }}
              >
                + ADD DRIVE LINK
              </button>
            ) : (
              <form onSubmit={handleAddMaterial} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300ff88%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px top 50%",
                      backgroundSize: "10px auto",
                      paddingRight: "30px",
                    }}
                  >
                    <option value="" style={{ background: "#0a0f14", color: "#8899aa" }}>
                      Select a section...
                    </option>
                    {sections.map((s) => (
                      <option key={s.id} value={s.id} style={{ background: "#0a0f14", color: "#ccd8e4" }}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Lecture 1 - Introduction"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Drive Link URL</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" style={primaryButtonStyle}
                    onMouseEnter={(e) => { e.target.style.opacity = "0.8"; }}
                    onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
                  >
                    ADD MATERIAL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddForm(false); setFormData({ title: "", url: "" }); setSelectedSection(""); }}
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => { e.target.style.color = "#fff"; e.target.style.borderColor = "#fff"; }}
                    onMouseLeave={(e) => { e.target.style.color = "#8899aa"; e.target.style.borderColor = "#8899aa"; }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Add Custom Section — auth only */}
        {user && (
          <div
            style={{
              marginTop: "16px",
              padding: "20px",
              border: "1px solid rgba(204,0,255,0.3)",
              borderRadius: "4px",
              background: "rgba(204,0,255,0.05)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#cc00ff",
                marginBottom: "16px",
                textTransform: "uppercase",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "14px" }}>🔧</span> Add Custom Section
            </div>

            {!showSectionForm ? (
              <button
                onClick={() => setShowSectionForm(true)}
                style={{
                  background: "rgba(204,0,255,0.1)",
                  border: "1px solid #cc00ff",
                  color: "#cc00ff",
                  padding: "10px 20px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(204,0,255,0.2)"; }}
                onMouseLeave={(e) => { e.target.style.background = "rgba(204,0,255,0.1)"; }}
              >
                + CREATE NEW SECTION
              </button>
            ) : (
              <form onSubmit={handleAddSection} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ ...labelStyle, color: "#cc00ff" }}>Section Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Lab Reports, Assignments, Tutorials"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    style={{ ...inputStyle, borderColor: "rgba(204,0,255,0.2)" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    style={{ ...primaryButtonStyle, background: "#cc00ff" }}
                    onMouseEnter={(e) => { e.target.style.opacity = "0.8"; }}
                    onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
                  >
                    CREATE SECTION
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowSectionForm(false); setNewSectionName(""); }}
                    style={secondaryButtonStyle}
                    onMouseEnter={(e) => { e.target.style.color = "#fff"; e.target.style.borderColor = "#fff"; }}
                    onMouseLeave={(e) => { e.target.style.color = "#8899aa"; e.target.style.borderColor = "#8899aa"; }}
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
