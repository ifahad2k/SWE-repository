import { useState } from "react";
import { hexToRgb, getOrdinal } from "../utils/helpers";
import { SEMESTER_COLORS, SEMESTER_ICONS } from "../styles";
import CourseCard from "./CourseCard";

export default function SemesterList({
  semesters,
  user,
  onOpenCourse,
  onAddCourse,
  onDeleteCourse,
  onShowAddCourseForm,
}) {
  const [activeSemester, setActiveSemester] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {semesters.map((semester, si) => {
        const isOpen = activeSemester === semester.number;
        const color = SEMESTER_COLORS[si] || "#00ff88";
        const icon = SEMESTER_ICONS[si] || "📗";
        const courseCount = semester.courses ? semester.courses.length : 0;

        return (
          <div
            key={semester.number}
            style={{
              border: `1px solid ${isOpen ? color : "rgba(255,255,255,0.08)"}`,
              borderRadius: "4px",
              background: isOpen
                ? `rgba(${hexToRgb(color)}, 0.04)`
                : "rgba(255,255,255,0.02)",
              transition: "all 0.3s ease",
              overflow: "hidden",
            }}
          >
            {/* Semester header */}
            <div
              onClick={() => setActiveSemester(isOpen ? null : semester.number)}
              style={{
                padding: "20px 24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              {/* Semester number badge */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "4px",
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  letterSpacing: "1px",
                  color: color,
                  flexShrink: 0,
                  fontWeight: "700",
                  background: `rgba(${hexToRgb(color)}, 0.1)`,
                }}
              >
                S{String(semester.number).padStart(2, "0")}
              </div>

              {/* Semester info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      color: color,
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                    }}
                  >
                    Semester {semester.number}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#445566",
                      border: "1px solid #223344",
                      padding: "1px 8px",
                      borderRadius: "2px",
                    }}
                  >
                    {courseCount} {courseCount === 1 ? "course" : "courses"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#ffffff",
                    marginTop: "4px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {icon} {getOrdinal(semester.number)} Semester
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#667788",
                    marginTop: "4px",
                    lineHeight: 1.5,
                  }}
                >
                  Undergraduate Software Engineering — Year{" "}
                  {Math.ceil(semester.number / 2)}
                </div>
              </div>

              {/* Expand icon */}
              <div
                style={{
                  color: color,
                  fontSize: "18px",
                  flexShrink: 0,
                  transition: "transform 0.3s",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                }}
              >
                +
              </div>
            </div>

            {/* Semester content — courses */}
            {isOpen && (
              <div
                style={{
                  padding: "0 24px 24px 24px",
                  borderTop: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  {courseCount > 0 ? (
                    semester.courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        semesterColor={color}
                        semesterNumber={semester.number}
                        user={user}
                        onOpen={() => onOpenCourse(course, semester)}
                        onDelete={() =>
                          onDeleteCourse(semester.number, course.id, course.name)
                        }
                      />
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        border: "1px dashed rgba(255,255,255,0.1)",
                        borderRadius: "4px",
                        background: "rgba(255,255,255,0.01)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "24px",
                          marginBottom: "8px",
                          opacity: 0.4,
                        }}
                      >
                        📂
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#445566",
                          letterSpacing: "1px",
                        }}
                      >
                        No courses added yet
                      </div>
                      {user && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#334455",
                            marginTop: "4px",
                          }}
                        >
                          Click "Add Course" below to get started
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Course Button — auth only */}
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowAddCourseForm(semester.number);
                      }}
                      style={{
                        background: `linear-gradient(135deg, rgba(${hexToRgb(color)}, 0.15), rgba(${hexToRgb(color)}, 0.05))`,
                        border: `1px solid ${color}`,
                        color: color,
                        padding: "12px 20px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "700",
                        letterSpacing: "1px",
                        fontFamily: "inherit",
                        transition: "all 0.2s ease",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = `rgba(${hexToRgb(color)}, 0.25)`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = `linear-gradient(135deg, rgba(${hexToRgb(color)}, 0.15), rgba(${hexToRgb(color)}, 0.05))`;
                      }}
                    >
                      ➕ ADD COURSE
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
