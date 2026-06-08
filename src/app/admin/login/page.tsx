"use client";

// ============================================================
// ADMIN LOGIN PAGE
// ============================================================

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
             style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-display text-3xl text-[var(--color-accent)] tracking-[0.15em] block mb-2">
            ADMIN
          </span>
          <div className="divider-accent" />
          <p className="text-[var(--color-text-muted)] text-sm font-arabic mt-4">
            لوحة التحكم الإدارية
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 card-luxury p-8">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[var(--color-text-muted)] mb-2 font-arabic">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-luxury text-center text-lg tracking-widest"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center font-arabic">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-luxury-fill w-full font-arabic"
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
