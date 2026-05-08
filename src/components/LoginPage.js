import { useState } from "react";
import { validateIUTEmail } from "../utils/helpers";
import { inputStyle, labelStyle, primaryButtonStyle, secondaryButtonStyle } from "../styles";

export default function LoginPage({ onLogin, onSwitchToRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateIUTEmail(email)) {
      setError("Email must be a valid IUT email (username@iut-dhaka.edu)");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "60px 20px" }}>
      <button onClick={onBack} style={{ ...secondaryButtonStyle, marginBottom: "32px", fontSize: "11px" }}
        onMouseEnter={(e) => { e.target.style.color = "#fff"; e.target.style.borderColor = "#fff"; }}
        onMouseLeave={(e) => { e.target.style.color = "#8899aa"; e.target.style.borderColor = "#8899aa"; }}
      >← BACK</button>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#00ff88", marginBottom: "16px", textTransform: "uppercase" }}>
          [ AUTHENTICATION ]
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "900", color: "#ffffff", margin: "0 0 8px 0" }}>
          LOGIN
        </h1>
        <p style={{ fontSize: "12px", color: "#667788", margin: 0 }}>
          Use your IUT credentials to access SWE Repository
        </p>
      </div>

      {error && (
        <div style={{
          padding: "12px 16px", marginBottom: "20px", borderRadius: "3px",
          background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)",
          color: "#ff4444", fontSize: "12px",
        }}>
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={labelStyle}>IUT Email</label>
          <input type="email" placeholder="username@iut-dhaka.edu" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input type="password" placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={{ ...primaryButtonStyle, width: "100%", marginTop: "8px", opacity: loading ? 0.6 : 1 }}
          onMouseEnter={(e) => { if (!loading) e.target.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { if (!loading) e.target.style.opacity = "1"; }}
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <span style={{ fontSize: "12px", color: "#556677" }}>Don't have an account? </span>
        <button onClick={onSwitchToRegister} style={{
          background: "none", border: "none", color: "#00ff88", cursor: "pointer",
          fontSize: "12px", fontFamily: "inherit", fontWeight: "700", textDecoration: "underline",
        }}>Register</button>
      </div>
    </div>
  );
}
