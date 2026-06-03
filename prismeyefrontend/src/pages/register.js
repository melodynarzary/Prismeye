import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/setup";
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080B18", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #8B8FA8; opacity: 1; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.05) inset !important;
          -webkit-text-fill-color: #C5C8E8 !important;
        }
        .register-btn:hover:not(:disabled) {
          background: #A99FF9 !important;
          box-shadow: 0 6px 28px rgba(124,111,247,0.4) !important;
        }
      `}</style>

      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,111,247,0.13) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 28, position: "relative" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="#7C6FF7">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </svg>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.9rem", color: "#ffffff", letterSpacing: 0.5, lineHeight: 1 }}>
          Prism<span style={{ color: "#7C6FF7" }}>Eye</span>
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: 440, background: "#0F1123", border: "1px solid rgba(124,111,247,0.15)", borderRadius: 16, padding: "36px 36px 32px", boxShadow: "0 12px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)", position: "relative" }}>
        <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: 4, textAlign: "center" }}>Create your Account</p>
        <p style={{ color: "#8B8FA8", fontSize: "0.88rem", marginBottom: 24, textAlign: "center" }}>Set up your PrismEye Account</p>

        {error && <div style={{ marginBottom: 18, padding: "11px 14px", background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.25)", borderRadius: 10, color: "#FF6B7A", fontSize: "0.88rem" }}>⚠ {error}</div>}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${nameFocus ? "#7C6FF7" : "rgba(124,111,247,0.15)"}`, borderRadius: 10, padding: "0 14px", transition: "border-color 0.2s" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setNameFocus(true)} onBlur={() => setNameFocus(false)} required style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#C5C8E8", fontSize: "0.92rem", padding: "12px 0" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${userFocus ? "#7C6FF7" : "rgba(124,111,247,0.15)"}`, borderRadius: 10, padding: "0 14px", transition: "border-color 0.2s" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8B8FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
            </svg>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)} required style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#C5C8E8", fontSize: "0.92rem", padding: "12px 0" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: `1.5px solid ${passFocus ? "#7C6FF7" : "rgba(124,111,247,0.15)"}`, borderRadius: 10, padding: "0 14px", transition: "border-color 0.2s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B8FA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)} required style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#C5C8E8", fontSize: "0.92rem", padding: "12px 0" }} />
            <div onClick={() => setShowPassword((v) => !v)} style={{ cursor: "pointer", color: "#8B8FA8", display: "flex", opacity: 0.7 }}>
              {showPassword ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading} style={{ marginTop: 4, width: "100%", padding: "13px", background: loading ? "#3a3650" : "#7C6FF7", color: loading ? "#8B8FA8" : "#fff", border: "none", borderRadius: 8, fontSize: "0.95rem", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: loading ? "default" : "pointer", boxShadow: loading ? "none" : "0 4px 18px rgba(124,111,247,0.3)", transition: "all 0.2s ease" }}>
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span style={{ color: "#8B8FA8", fontSize: "0.85rem" }}>
            Already have an account?{" "}
            <span
              onClick={() => router.push("/")}
              style={{ color: "#7C6FF7", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#A99FF9")}
              onMouseLeave={(e) => (e.target.style.color = "#7C6FF7")}
            >
              Sign in
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}