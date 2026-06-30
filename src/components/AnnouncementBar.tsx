"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "99%+ Purity — Verified by Janoshik & Freedom Diagnostics",
  "Free Cold-Chain Shipping on Orders Over $200",
  "Certificate of Analysis Enclosed With Every Order",
  "cGMP Manufactured · Research Use Only",
];

const STORAGE_KEY = "nexphoria-bar-dismissed";

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [slideUp, setSlideUp] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage not available (e.g. SSR, privacy mode)
    }
  }, []);

  // Rotate messages
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = () => {
    setSlideUp(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    // Wait for CSS animation to complete before unmounting
    setTimeout(() => setDismissed(true), 350);
  };

  if (dismissed) return null;

  return (
    <div
      className={`w-full relative${slideUp ? " announcement-slide-up" : ""}`}
      style={{
        backgroundColor: "#1A1A18",
        borderBottom: "1px solid rgba(184,164,76,0.25)",
      }}
    >
      <div className="flex items-center justify-center py-2.5 px-10 overflow-hidden">
        <span
          aria-hidden="true"
          className="mr-2.5 inline-block w-1 h-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: "#B8A44C", opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
        <p
          className="text-[10px] uppercase font-medium transition-opacity whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            letterSpacing: "0.15em",
            color: "#B8A44C",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease",
            lineHeight: 1.5,
          }}
        >
          {MESSAGES[idx]}
        </p>
      </div>
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:bg-white/10"
        style={{ color: "rgba(184,164,76,0.7)" }}
      >
        <X size={12} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
