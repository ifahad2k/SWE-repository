import { hexToRgb } from "../utils/helpers";

export default function Header({ user, onLoginClick, onRegisterClick, onLogout, onActivityLogClick, onHomeClick }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      marginBottom: "40px",
      flexWrap: "wrap",
      gap: "12px",
    }}>
      {/* Logo / Title */}
      <div
        onClick={onHomeClick}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}
      >
        <div style={{
          width: "40px", height: "40px", borderRadius: "4px",
          border: "2px solid #00ff88",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
          background: `rgba(${hexToRgb("#00ff88")}, 0.1)`,
        }}>📂</div>
        <div>
          <div style={{
            fontSize: "16px", fontWeight: "900", color: "#ffffff",
            letterSpacing: "2px",
          }}>
            SWE <span style={{ color: "#00ff88" }}>REPOSITORY</span>
          </div>
          <div style={{ fontSize: "9px", color: "#556677", letterSpacing: "2px" }}>
            IUT COURSE MATERIALS
          </div>
        </div>
      </div>

      {/* Right Side: Activity Log + Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Activity Log Button — auth only */}
        {user && (
          <button
            onClick={onActivityLogClick}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8899aa",
              padding: "6px 14px",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "10px",
              fontFamily: "inherit",
              letterSpacing: "1px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#ffdd00"; e.target.style.color = "#ffdd00"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "#8899aa"; }}
          >
            📋 LOG
          </button>
        )}

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              fontSize: "11px", color: "#00ff88",
              border: "1px solid rgba(0,255,136,0.2)",
              padding: "5px 12px", borderRadius: "3px",
              background: `rgba(${hexToRgb("#00ff88")}, 0.05)`,
              maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              ✓ {user.name || user.email}
            </div>
            <button
              onClick={onLogout}
              style={{
                background: "none",
                border: "1px solid rgba(255,68,68,0.3)",
                color: "#ff4444",
                padding: "6px 14px",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "10px",
                fontFamily: "inherit",
                letterSpacing: "1px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.background = "rgba(255,68,68,0.1)"; }}
              onMouseLeave={(e) => { e.target.style.background = "none"; }}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={onLoginClick}
              style={{
                background: `rgba(${hexToRgb("#00ff88")}, 0.1)`,
                border: "1px solid #00ff88",
                color: "#00ff88",
                padding: "6px 14px",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "10px",
                fontFamily: "inherit",
                fontWeight: "700",
                letterSpacing: "1px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.background = `rgba(${hexToRgb("#00ff88")}, 0.2)`; }}
              onMouseLeave={(e) => { e.target.style.background = `rgba(${hexToRgb("#00ff88")}, 0.1)`; }}
            >
              LOGIN
            </button>
            <button
              onClick={onRegisterClick}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#8899aa",
                padding: "6px 14px",
                borderRadius: "3px",
                cursor: "pointer",
                fontSize: "10px",
                fontFamily: "inherit",
                letterSpacing: "1px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#ffffff"; e.target.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "#8899aa"; }}
            >
              REGISTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
