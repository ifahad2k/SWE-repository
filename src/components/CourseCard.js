import { hexToRgb } from "../utils/helpers";

export default function CourseCard({ course, semesterColor, semesterNumber, user, onOpen, onDelete }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "3px",
        background: "rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Course code badge */}
        {course.code && (
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "2px",
              padding: "2px 8px",
              border: `1px solid ${semesterColor}`,
              color: semesterColor,
              borderRadius: "2px",
              flexShrink: 0,
              fontWeight: "700",
              background: `rgba(${hexToRgb(semesterColor)}, 0.1)`,
            }}
          >
            {course.code}
          </span>
        )}

        {/* Credit badge */}
        {course.credit && (
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "1px",
              padding: "2px 8px",
              border: "1px solid #445566",
              color: "#667788",
              borderRadius: "2px",
              flexShrink: 0,
            }}
          >
            {course.credit} CR
          </span>
        )}

        {/* Course name */}
        <span
          style={{
            flex: 1,
            fontSize: "13px",
            color: "#ccd8e4",
            fontWeight: "600",
            minWidth: 0,
          }}
        >
          {course.name}
        </span>

        {/* Materials count */}
        <span
          style={{
            fontSize: "10px",
            color: "#445566",
            flexShrink: 0,
          }}
        >
          {(course.sections || []).reduce(
            (total, s) => total + (s.materials ? s.materials.length : 0),
            0
          )}{" "}
          materials
        </span>
      </div>

      {/* Action buttons row */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "0 18px 14px 18px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          paddingTop: "10px",
        }}
      >
        {/* Open Materials button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          style={{
            flex: 1,
            background: `linear-gradient(135deg, rgba(${hexToRgb(semesterColor)}, 0.15), rgba(${hexToRgb(semesterColor)}, 0.05))`,
            border: `1px solid ${semesterColor}`,
            color: semesterColor,
            padding: "8px 16px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1px",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `rgba(${hexToRgb(semesterColor)}, 0.25)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `linear-gradient(135deg, rgba(${hexToRgb(semesterColor)}, 0.15), rgba(${hexToRgb(semesterColor)}, 0.05))`;
          }}
        >
          📚 OPEN MATERIALS
        </button>

        {/* Delete button — auth only */}
        {user && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete course "${course.name}" and all its materials?`)) {
                onDelete();
              }
            }}
            style={{
              background: "rgba(255,0,0,0.1)",
              border: "1px solid rgba(255,0,0,0.3)",
              color: "#ff4444",
              padding: "8px 14px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "10px",
              fontFamily: "inherit",
              fontWeight: "700",
              letterSpacing: "1px",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,0,0,0.1)";
            }}
          >
            ✖ DELETE
          </button>
        )}
      </div>
    </div>
  );
}
