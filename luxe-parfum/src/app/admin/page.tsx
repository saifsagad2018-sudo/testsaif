"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "380px", background: "var(--surface)", border: "1px solid var(--border)", padding: "3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--text)" }}>Admin</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>Dashboard Access</p>
          <div style={{ width: "40px", height: "1px", background: "var(--gold)", margin: "1rem auto 0" }} />
        </div>
        <form onSubmit={login}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", display: "block", marginBottom: "0.5rem" }}>Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="lux-input" placeholder="Enter admin password" required />
          </div>
          {error && <p style={{ color: "#e05555", fontSize: "0.75rem", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" className="btn-gold" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Verifying…" : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
