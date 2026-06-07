"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: "", password: "", confirm: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.password && formData.password === formData.confirm) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#EAE7E3", paddingTop: "100px" }}>
        <div className="w-full max-w-md text-center rounded-2xl p-10" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: "rgba(164,176,138,0.15)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8A44C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl mb-3" style={{ fontWeight: 300, color: "#010101" }}>Account Created</h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: "#7F7F7D" }}>
            Welcome to Nexphoria. Your research account is ready.
          </p>
          <Link href="/products" className="btn-primary">
            Browse Compounds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EAE7E3", paddingTop: "120px", paddingBottom: "64px" }}>
      <div className="w-full max-w-md mx-auto px-6">
        <Link
          href="/"
          className="text-xs uppercase inline-flex items-center gap-1.5 mb-10 transition-opacity hover:opacity-70"
          style={{ color: "#7F7F7D", letterSpacing: "0.12em" }}
        >
          ← Back
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 200, color: "#010101", letterSpacing: "-0.01em" }}>Create Account</h1>
          <p className="text-sm" style={{ color: "#7F7F7D" }}>Research-grade compounds for qualified researchers</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#F9F9F9", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "#7F7F7D", letterSpacing: "0.1em" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="researcher@institution.edu"
                className="w-full px-4 py-3 text-sm rounded-lg border transition-colors"
                style={{ backgroundColor: "#F7F6F1", border: "1px solid rgba(0,0,0,0.1)", color: "#010101", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8A44C")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "#7F7F7D", letterSpacing: "0.1em" }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-lg border transition-colors"
                style={{ backgroundColor: "#F7F6F1", border: "1px solid rgba(0,0,0,0.1)", color: "#010101", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8A44C")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: "#7F7F7D", letterSpacing: "0.1em" }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm"
                name="confirm"
                value={formData.confirm}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm rounded-lg border transition-colors"
                style={{ backgroundColor: "#F7F6F1", border: "1px solid rgba(0,0,0,0.1)", color: "#010101", outline: "none" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#B8A44C")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-7" style={{ color: "#7F7F7D" }}>
          Already have an account?{" "}
          <Link href="/account/login" style={{ color: "#010101", fontWeight: 500 }}>
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs mt-6 leading-relaxed" style={{ color: "#9A968F" }}>
          By creating an account, you confirm you are a qualified researcher
          and agree to our <Link href="/terms" style={{ color: "#010101" }}>Terms</Link> and{" "}
          <Link href="/privacy" style={{ color: "#010101" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
