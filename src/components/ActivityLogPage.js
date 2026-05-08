import { useState, useMemo } from "react";
import { hexToRgb, formatTimestamp } from "../utils/helpers";
import {
  SEMESTER_COLORS,
  inputStyle,
  labelStyle,
  backButtonStyle,
  secondaryButtonStyle,
} from "../styles";

const ACTION_COLORS = {
  ADD_COURSE: "#00ff88",
  REMOVE_COURSE: "#ff4444",
  ADD_MATERIAL: "#00ccff",
  REMOVE_MATERIAL: "#ff8800",
  ADD_SECTION: "#cc00ff",
  REMOVE_SECTION: "#ffdd00",
};

const ACTION_ICONS = {
  ADD_COURSE: "✚",
  REMOVE_COURSE: "✖",
  ADD_MATERIAL: "✚",
  REMOVE_MATERIAL: "✖",
  ADD_SECTION: "✚",
  REMOVE_SECTION: "✖",
};

const ITEMS_PER_PAGE = 20;

export default function ActivityLogPage({ logs, onBack }) {
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [page, setPage] = useState(0);

  // Deduplicate user list
  const uniqueUsers = useMemo(() => {
    const users = new Set();
    (logs || []).forEach((log) => {
      if (log.userName) users.add(log.userName);
    });
    return Array.from(users).sort();
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return (logs || [])
      .filter((log) => {
        if (filterSemester !== "all" && log.semesterNumber !== parseInt(filterSemester)) return false;
        if (filterAction !== "all" && log.action !== filterAction) return false;
        if (filterUser && log.userName !== filterUser) return false;
        return true;
      })
      .sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return bTime - aTime;
      });
  }, [logs, filterSemester, filterAction, filterUser]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={backButtonStyle}
        onMouseEnter={(e) => { e.target.style.borderColor = "#ffdd00"; e.target.style.color = "#ffdd00"; }}
        onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "#8899aa"; }}
      >
        ← BACK TO SEMESTERS
      </button>

      {/* Page Header */}
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#ffdd00", marginBottom: "16px", textTransform: "uppercase" }}>
          [ SYSTEM LOG ]
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#ffffff", margin: "0 0 8px 0" }}>
          📋 Activity Log
        </h1>
        <p style={{ fontSize: "12px", color: "#667788", margin: 0, letterSpacing: "1px" }}>
          All changes to courses and materials are recorded here
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "28px",
          padding: "16px",
          border: "1px solid rgba(255,221,0,0.15)",
          borderRadius: "4px",
          background: "rgba(255,221,0,0.03)",
        }}
      >
        <div>
          <label style={{ ...labelStyle, color: "#ffdd00" }}>Semester</label>
          <select
            value={filterSemester}
            onChange={(e) => { setFilterSemester(e.target.value); setPage(0); }}
            style={{
              ...inputStyle,
              cursor: "pointer",
              borderColor: "rgba(255,221,0,0.2)",
            }}
          >
            <option value="all" style={{ background: "#0a0f14" }}>All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} style={{ background: "#0a0f14" }}>
                Semester {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ ...labelStyle, color: "#ffdd00" }}>Action</label>
          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(0); }}
            style={{
              ...inputStyle,
              cursor: "pointer",
              borderColor: "rgba(255,221,0,0.2)",
            }}
          >
            <option value="all" style={{ background: "#0a0f14" }}>All Actions</option>
            <option value="ADD_COURSE" style={{ background: "#0a0f14" }}>Add Course</option>
            <option value="REMOVE_COURSE" style={{ background: "#0a0f14" }}>Remove Course</option>
            <option value="ADD_MATERIAL" style={{ background: "#0a0f14" }}>Add Material</option>
            <option value="REMOVE_MATERIAL" style={{ background: "#0a0f14" }}>Remove Material</option>
            <option value="ADD_SECTION" style={{ background: "#0a0f14" }}>Add Section</option>
            <option value="REMOVE_SECTION" style={{ background: "#0a0f14" }}>Remove Section</option>
          </select>
        </div>
        <div>
          <label style={{ ...labelStyle, color: "#ffdd00" }}>User</label>
          <select
            value={filterUser}
            onChange={(e) => { setFilterUser(e.target.value); setPage(0); }}
            style={{
              ...inputStyle,
              cursor: "pointer",
              borderColor: "rgba(255,221,0,0.2)",
            }}
          >
            <option value="" style={{ background: "#0a0f14" }}>All Users</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u} style={{ background: "#0a0f14" }}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ fontSize: "10px", color: "#556677", letterSpacing: "1px", marginBottom: "16px" }}>
        SHOWING {paginatedLogs.length} OF {filteredLogs.length} ENTRIES — PAGE {page + 1}/{totalPages}
      </div>

      {/* Log Entries */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
          background: "rgba(0,0,0,0.3)",
          overflow: "hidden",
        }}
      >
        {paginatedLogs.length > 0 ? (
          paginatedLogs.map((log, idx) => {
            const color = ACTION_COLORS[log.action] || "#8899aa";
            const icon = ACTION_ICONS[log.action] || "•";
            const semColor = log.semesterNumber
              ? SEMESTER_COLORS[log.semesterNumber - 1] || "#8899aa"
              : "#8899aa";

            return (
              <div
                key={log.id || idx}
                style={{
                  padding: "14px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Timestamp + user */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "10px", color: "#445566", fontFamily: "'Courier New', monospace" }}>
                    [{formatTimestamp(log.timestamp)}]
                  </span>
                  <span style={{ fontSize: "10px", color: "#8899aa", fontWeight: "600" }}>
                    {log.userName || "Unknown User"}
                  </span>
                  {log.userRoll && (
                    <span style={{
                      fontSize: "9px", color: "#445566",
                      border: "1px solid #223344", padding: "0px 6px", borderRadius: "2px",
                    }}>
                      {log.userRoll}
                    </span>
                  )}
                </div>
                {/* Action */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "4px" }}>
                  <span style={{ color, fontSize: "14px", fontWeight: "900" }}>{icon}</span>
                  <span style={{ fontSize: "12px", color: "#ccd8e4" }}>
                    {log.details}
                  </span>
                  {log.semesterNumber && (
                    <span style={{
                      fontSize: "8px", color: semColor,
                      border: `1px solid ${semColor}`,
                      padding: "1px 6px", borderRadius: "2px",
                      background: `rgba(${hexToRgb(semColor)}, 0.1)`,
                      flexShrink: 0,
                    }}>
                      S{String(log.semesterNumber).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px", opacity: 0.3 }}>📋</div>
            <div style={{ fontSize: "12px", color: "#445566", letterSpacing: "1px" }}>
              No activity recorded yet
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{
              ...secondaryButtonStyle,
              opacity: page === 0 ? 0.3 : 1,
              fontSize: "11px",
            }}
          >
            ← PREV
          </button>
          <div style={{ display: "flex", alignItems: "center", fontSize: "11px", color: "#667788", padding: "0 12px" }}>
            {page + 1} / {totalPages}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            style={{
              ...secondaryButtonStyle,
              opacity: page >= totalPages - 1 ? 0.3 : 1,
              fontSize: "11px",
            }}
          >
            NEXT →
          </button>
        </div>
      )}
    </div>
  );
}
