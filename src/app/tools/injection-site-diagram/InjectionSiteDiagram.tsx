"use client";

import { useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCatalogCTA from "@/components/tools/ToolCatalogCTA";

// ─── Zone data ───────────────────────────────────────────────────────────────
type InjectionType = "SC" | "IM" | "SC/IM";

interface Zone {
  id: string;
  label: string;
  shortLabel: string;
  type: InjectionType;
  needleLength: string;
  angle: string;
  maxVolume: string;
  rotationAdvice: string;
  technique: string[];
  commonMistakes: string[];
  compounds: string[];
  color: string;
  hoverColor: string;
}

const ZONES: Record<string, Zone> = {
  abdomen_right: {
    id: "abdomen_right",
    label: "Right Abdomen",
    shortLabel: "Abdomen (R)",
    type: "SC",
    needleLength: "4–6 mm (29–31G)",
    angle: "45–90°",
    maxVolume: "1 mL per injection",
    rotationAdvice:
      "Rotate at least 2 cm from previous site. Use a 4-quadrant clockwise rotation within the abdominal region (right-upper → right-lower → left-lower → left-upper).",
    technique: [
      "Pinch 1–2 inches of skin between thumb and forefinger.",
      "Insert needle at 45° if tissue is thin, 90° if adequate subcutaneous fat.",
      "Release pinched skin before injecting if using 90°.",
      "Inject slowly over 5–10 seconds.",
      "Remove needle and apply gentle pressure (do not rub — rubbing disperses and irritates).",
    ],
    commonMistakes: [
      "Injecting within 2 cm of the navel — increased vascularity and lymphatics cause faster absorption and more bruising.",
      "Rubbing the site post-injection — accelerates absorption but increases local irritation.",
      "Reusing the same quadrant consecutive days — leads to lipohypertrophy over time.",
      "Injecting too deeply — risks IM injection in lean subjects.",
    ],
    compounds: [
      "BPC-157",
      "TB-500",
      "CJC-1295",
      "Ipamorelin",
      "Semaglutide",
      "Tirzepatide",
      "GHK-Cu",
      "Epitalon",
    ],
    color: "#d4af37",
    hoverColor: "#b8962e",
  },
  abdomen_left: {
    id: "abdomen_left",
    label: "Left Abdomen",
    shortLabel: "Abdomen (L)",
    type: "SC",
    needleLength: "4–6 mm (29–31G)",
    angle: "45–90°",
    maxVolume: "1 mL per injection",
    rotationAdvice:
      "Mirror rotation to right abdomen. Alternate sides daily to maximize recovery time per site.",
    technique: [
      "Pinch 1–2 inches of skin between thumb and forefinger.",
      "Insert needle at 45° if tissue is thin, 90° if adequate subcutaneous fat.",
      "Release pinched skin before injecting if using 90°.",
      "Inject slowly over 5–10 seconds.",
      "Remove needle and apply gentle pressure (do not rub).",
    ],
    commonMistakes: [
      "Injecting within 2 cm of the navel — avoid this zone bilaterally.",
      "Injecting in the same spot repeatedly — causes localized lipohypertrophy.",
      "Using too short a needle in subjects with thick adipose — leads to very shallow injection with inconsistent absorption.",
    ],
    compounds: [
      "BPC-157",
      "TB-500",
      "CJC-1295",
      "Ipamorelin",
      "Semaglutide",
      "Tirzepatide",
      "GHK-Cu",
      "Epitalon",
    ],
    color: "#d4af37",
    hoverColor: "#b8962e",
  },
  thigh_right: {
    id: "thigh_right",
    label: "Right Anterior Thigh",
    shortLabel: "Thigh (R)",
    type: "SC/IM",
    needleLength: "SC: 4–6 mm | IM: 16–25 mm (22–25G)",
    angle: "SC: 45–90° | IM: 90°",
    maxVolume: "SC: 0.5 mL | IM: 2 mL",
    rotationAdvice:
      "Divide the anterior thigh into thirds (proximal, mid, distal). Rotate between sections. Avoid the lateral band (IT band region) — fibrous tissue, painful. Keep injections ≥2 cm apart.",
    technique: [
      "SC: Relax the thigh muscle. Pinch the skin and fat away from the muscle belly.",
      "IM: Tense the muscle or divide the tension to find the softer mid-belly area. No skin pinch for IM.",
      "Target the mid-anterior quadrant (vastus lateralis belly) for IM.",
      "Insert at 45° SC or 90° IM.",
      "Aspirate is not required for vastus lateralis IM (low major vessel risk).",
      "Withdraw smoothly; apply light pressure.",
    ],
    commonMistakes: [
      "IM into the lateral thigh over IT band — extremely painful, poor absorption.",
      "SC into mid-thigh where adipose is minimal in lean subjects — inadvertent IM injection.",
      "Not relaxing the leg for IM — tense muscle increases resistance and pain.",
      "Exceeding 2 mL IM — causes distension pain and slow absorption.",
    ],
    compounds: [
      "TB-500",
      "BPC-157",
      "GHRP-2",
      "GHRP-6",
      "NAD+",
      "Semaglutide",
      "Tirzepatide",
    ],
    color: "#7EB3A0",
    hoverColor: "#5a9a85",
  },
  thigh_left: {
    id: "thigh_left",
    label: "Left Anterior Thigh",
    shortLabel: "Thigh (L)",
    type: "SC/IM",
    needleLength: "SC: 4–6 mm | IM: 16–25 mm (22–25G)",
    angle: "SC: 45–90° | IM: 90°",
    maxVolume: "SC: 0.5 mL | IM: 2 mL",
    rotationAdvice:
      "Alternate sides (L/R) each injection. Use the same positional sub-zone within each side in rotation (proximal → mid → distal).",
    technique: [
      "SC: Relax the thigh muscle. Pinch the skin and fat away from the muscle belly.",
      "IM: Tense the muscle or divide the tension to find the softer mid-belly area.",
      "Target vastus lateralis mid-belly for IM (outer anterior surface).",
      "Insert at 45° SC or 90° IM.",
      "Withdraw smoothly; apply light pressure.",
    ],
    commonMistakes: [
      "Injecting too medially — risk of sciatic or femoral nerve proximity in very medial approaches.",
      "Leaving needle bevel facing the wrong direction — bevel should face up for SC.",
    ],
    compounds: [
      "TB-500",
      "BPC-157",
      "GHRP-2",
      "GHRP-6",
      "NAD+",
      "Semaglutide",
      "Tirzepatide",
    ],
    color: "#7EB3A0",
    hoverColor: "#5a9a85",
  },
  deltoid_right: {
    id: "deltoid_right",
    label: "Right Deltoid",
    shortLabel: "Deltoid (R)",
    type: "IM",
    needleLength: "16–25 mm (23–25G)",
    angle: "90°",
    maxVolume: "1 mL",
    rotationAdvice:
      "Small muscle volume limits rotation options. Reserve for low-volume IM injections only (≤1 mL). Alternate with left deltoid every injection.",
    technique: [
      "Expose the upper arm fully; identify the acromion process (shoulder bony point).",
      "Target 2–3 cm below the acromion, in the center of the deltoid muscle belly.",
      "Insert at 90° to the skin surface.",
      "Maximum volume 1 mL — exceed this in thigh or glute instead.",
      "Avoid the lateral deltoid edge — axillary nerve runs in the lateral and inferior deltoid territory.",
    ],
    commonMistakes: [
      "Injecting too low (below mid-deltoid) — risk of axillary nerve damage.",
      "Injecting too high into the subacromial bursa — causes bursitis (SIRVA).",
      "Volumes >1 mL — causes significant pain and swelling in this small muscle.",
      "Injecting into the posterior deltoid — harder access, risk of axillary nerve.",
    ],
    compounds: ["Oxytocin", "Melanotan II", "GHRP-2", "PT-141"],
    color: "#9B8EC4",
    hoverColor: "#7d6fa8",
  },
  deltoid_left: {
    id: "deltoid_left",
    label: "Left Deltoid",
    shortLabel: "Deltoid (L)",
    type: "IM",
    needleLength: "16–25 mm (23–25G)",
    angle: "90°",
    maxVolume: "1 mL",
    rotationAdvice:
      "Alternate L/R deltoid. For high-frequency protocols consider moving volume-intensive injections to thigh or glute.",
    technique: [
      "Expose the upper arm fully; identify the acromion process.",
      "Target 2–3 cm below the acromion, in the center of the deltoid belly.",
      "Insert at 90° to the skin.",
      "Do not exceed 1 mL.",
      "Withdraw; apply light pressure.",
    ],
    commonMistakes: [
      "Too-low injection — axillary nerve damage risk.",
      "SIRVA (Shoulder Injury Related to Vaccine Administration) — caused by too-high injection into bursa.",
      "Injecting into a contracted muscle — relax arm to the side.",
    ],
    compounds: ["Oxytocin", "Melanotan II", "GHRP-2", "PT-141"],
    color: "#9B8EC4",
    hoverColor: "#7d6fa8",
  },
  glute_right: {
    id: "glute_right",
    label: "Right Ventrogluteal",
    shortLabel: "Glute (R)",
    type: "IM",
    needleLength: "25–38 mm (21–23G)",
    angle: "90°",
    maxVolume: "3 mL",
    rotationAdvice:
      "Ventrogluteal preferred over dorsogluteal — no major nerves or vessels in the target zone. Alternate L/R glute. Divide each cheek into 4 quadrants for extended rotation.",
    technique: [
      "Position: side-lying (lateral decubitus) or standing — relaxes the muscle.",
      "Locate the greater trochanter and anterior superior iliac spine (ASIS).",
      "Ventrogluteal site: place palm on greater trochanter, point index finger toward ASIS, point middle finger toward iliac crest — inject in the triangle between the fingers.",
      "Insert 38 mm (1.5\") needle at 90°.",
      "Aspirate is not required for ventrogluteal site (low major vessel risk).",
      "Inject slowly (10–15 seconds per mL for viscous solutions).",
    ],
    commonMistakes: [
      "Using the dorsogluteal site instead — risk of sciatic nerve damage.",
      "Injecting in the wrong anatomical zone — review landmarks each time.",
      "Tensing the muscle — lie comfortably to relax the gluteus.",
      "Using too short a needle in obese subjects — tissue depth can exceed 38 mm.",
    ],
    compounds: ["TB-500", "NAD+", "Semaglutide", "Tirzepatide", "GHRP-2"],
    color: "#E07B54",
    hoverColor: "#c45e36",
  },
  glute_left: {
    id: "glute_left",
    label: "Left Ventrogluteal",
    shortLabel: "Glute (L)",
    type: "IM",
    needleLength: "25–38 mm (21–23G)",
    angle: "90°",
    maxVolume: "3 mL",
    rotationAdvice:
      "Same ventrogluteal technique. Alternate L/R. Ventrogluteal is the preferred large-volume IM site.",
    technique: [
      "Position in side-lying or standing to relax muscle.",
      "Use palm-on-trochanter landmark technique (same as right side, mirrored).",
      "Insert at 90°.",
      "Inject slowly for large volumes.",
    ],
    commonMistakes: [
      "Dorsogluteal approach — avoid due to sciatic nerve risk.",
      "Injecting while standing with weight on that leg — increases muscle tension.",
    ],
    compounds: ["TB-500", "NAD+", "Semaglutide", "Tirzepatide", "GHRP-2"],
    color: "#E07B54",
    hoverColor: "#c45e36",
  },
};

// ─── SVG Body Diagram (front + back) ─────────────────────────────────────────

interface ZoneHitArea {
  zoneId: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  label: string;
}

// Positions on the FRONT body SVG (viewBox 0 0 200 400)
const FRONT_ZONES: ZoneHitArea[] = [
  { zoneId: "abdomen_right", cx: 92, cy: 195, rx: 22, ry: 18, label: "Abdomen\n(R)" },
  { zoneId: "abdomen_left", cx: 108, cy: 195, rx: 22, ry: 18, label: "Abdomen\n(L)" },
  { zoneId: "thigh_right", cx: 83, cy: 295, rx: 16, ry: 24, label: "Thigh\n(R)" },
  { zoneId: "thigh_left", cx: 117, cy: 295, rx: 16, ry: 24, label: "Thigh\n(L)" },
  { zoneId: "deltoid_right", cx: 62, cy: 158, rx: 13, ry: 14, label: "Deltoid\n(R)" },
  { zoneId: "deltoid_left", cx: 138, cy: 158, rx: 13, ry: 14, label: "Deltoid\n(L)" },
];

// Positions on the BACK body SVG (viewBox 0 0 200 400)
const BACK_ZONES: ZoneHitArea[] = [
  { zoneId: "glute_right", cx: 88, cy: 215, rx: 22, ry: 20, label: "Glute\n(R)" },
  { zoneId: "glute_left", cx: 112, cy: 215, rx: 22, ry: 20, label: "Glute\n(L)" },
];

// ─── Body SVG paths (minimal humanoid silhouette) ────────────────────────────

function FrontBodySVG({
  selectedZone,
  onZoneClick,
}: {
  selectedZone: string | null;
  onZoneClick: (id: string) => void;
}) {
  return (
    <svg
      viewBox="0 0 200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[200px]"
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
      aria-label="Front body diagram"
    >
      {/* ── Silhouette fill ── */}
      {/* Head */}
      <ellipse cx="100" cy="52" rx="26" ry="30" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Neck */}
      <rect x="92" y="78" width="16" height="14" rx="4" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Torso */}
      <path d="M65 90 Q60 92 58 100 L54 170 Q54 175 60 176 L140 176 Q146 175 146 170 L142 100 Q140 92 135 90 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Shoulders / Upper arm connectors */}
      <ellipse cx="52" cy="110" rx="14" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="148" cy="110" rx="14" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Left arm (viewer's right) */}
      <path d="M38 110 Q28 115 26 140 Q24 160 28 185 L40 185 Q44 160 46 140 Q50 120 52 110 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Right arm (viewer's left) */}
      <path d="M162 110 Q172 115 174 140 Q176 160 172 185 L160 185 Q156 160 154 140 Q150 120 148 110 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Forearms */}
      <path d="M28 185 Q24 210 26 230 L38 228 Q38 208 40 185 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M172 185 Q176 210 174 230 L162 228 Q162 208 160 185 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Hands */}
      <ellipse cx="32" cy="235" rx="7" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="168" cy="235" rx="7" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Pelvis */}
      <path d="M60 176 Q58 182 58 188 Q58 200 70 200 L130 200 Q142 200 142 188 Q142 182 140 176 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Left leg */}
      <path d="M70 200 Q66 240 68 280 Q70 310 72 340 L88 340 Q88 310 87 280 Q86 240 84 200 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Right leg */}
      <path d="M130 200 Q134 240 132 280 Q130 310 128 340 L112 340 Q113 310 113 280 Q114 240 116 200 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Calves */}
      <path d="M72 340 Q70 365 72 385 L88 385 Q88 365 88 340 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M112 340 Q112 365 112 385 L128 385 Q130 365 128 340 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Feet */}
      <ellipse cx="80" cy="392" rx="12" ry="8" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="120" cy="392" rx="12" ry="8" fill="#2A2A2A" stroke="#444" strokeWidth="1" />

      {/* ── Injection zone hit areas ── */}
      {FRONT_ZONES.map((z) => {
        const zone = ZONES[z.zoneId];
        const isSelected = selectedZone === z.zoneId;
        const lines = z.label.split("\n");
        return (
          <g
            key={z.zoneId}
            onClick={() => onZoneClick(z.zoneId)}
            style={{ cursor: "pointer" }}
            aria-label={`Select ${zone.label} injection zone`}
          >
            <ellipse
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              fill={isSelected ? zone.color : zone.color + "55"}
              stroke={zone.color}
              strokeWidth={isSelected ? 2 : 1.5}
              style={{ transition: "fill 0.15s, stroke-width 0.15s" }}
            />
            {lines.map((line, i) => (
              <text
                key={i}
                x={z.cx}
                y={z.cy - (lines.length - 1) * 5 + i * 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontFamily="system-ui, sans-serif"
                fill={isSelected ? "#000" : "#F9F9F9"}
                fontWeight={isSelected ? "700" : "500"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function BackBodySVG({
  selectedZone,
  onZoneClick,
}: {
  selectedZone: string | null;
  onZoneClick: (id: string) => void;
}) {
  return (
    <svg
      viewBox="0 0 200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[200px]"
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
      aria-label="Back body diagram"
    >
      {/* Head */}
      <ellipse cx="100" cy="52" rx="26" ry="30" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Neck */}
      <rect x="92" y="78" width="16" height="14" rx="4" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Torso back */}
      <path d="M65 90 Q60 92 58 100 L54 170 Q54 175 60 176 L140 176 Q146 175 146 170 L142 100 Q140 92 135 90 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Shoulders */}
      <ellipse cx="52" cy="110" rx="14" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="148" cy="110" rx="14" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Arms */}
      <path d="M38 110 Q28 115 26 140 Q24 160 28 185 L40 185 Q44 160 46 140 Q50 120 52 110 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M162 110 Q172 115 174 140 Q176 160 172 185 L160 185 Q156 160 154 140 Q150 120 148 110 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M28 185 Q24 210 26 230 L38 228 Q38 208 40 185 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M172 185 Q176 210 174 230 L162 228 Q162 208 160 185 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="32" cy="235" rx="7" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="168" cy="235" rx="7" ry="10" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Pelvis / glutes */}
      <path d="M60 176 Q55 185 55 200 Q55 215 68 216 L100 216 L132 216 Q145 215 145 200 Q145 185 140 176 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      {/* Legs back */}
      <path d="M70 216 Q66 240 68 280 Q70 310 72 340 L88 340 Q88 310 87 280 Q86 240 84 216 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M130 216 Q134 240 132 280 Q130 310 128 340 L112 340 Q113 310 113 280 Q114 240 116 216 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M72 340 Q70 365 72 385 L88 385 Q88 365 88 340 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <path d="M112 340 Q112 365 112 385 L128 385 Q130 365 128 340 Z" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="80" cy="392" rx="12" ry="8" fill="#2A2A2A" stroke="#444" strokeWidth="1" />
      <ellipse cx="120" cy="392" rx="12" ry="8" fill="#2A2A2A" stroke="#444" strokeWidth="1" />

      {/* Glute zones */}
      {BACK_ZONES.map((z) => {
        const zone = ZONES[z.zoneId];
        const isSelected = selectedZone === z.zoneId;
        const lines = z.label.split("\n");
        return (
          <g
            key={z.zoneId}
            onClick={() => onZoneClick(z.zoneId)}
            style={{ cursor: "pointer" }}
            aria-label={`Select ${zone.label} injection zone`}
          >
            <ellipse
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              fill={isSelected ? zone.color : zone.color + "55"}
              stroke={zone.color}
              strokeWidth={isSelected ? 2 : 1.5}
              style={{ transition: "fill 0.15s, stroke-width 0.15s" }}
            />
            {lines.map((line, i) => (
              <text
                key={i}
                x={z.cx}
                y={z.cy - (lines.length - 1) * 5 + i * 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontFamily="system-ui, sans-serif"
                fill={isSelected ? "#000" : "#F9F9F9"}
                fontWeight={isSelected ? "700" : "500"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Zone type badge ─────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: InjectionType }) {
  if (type === "SC")
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-sm font-medium"
        style={{ backgroundColor: "#d4af3733", color: "#d4af37", border: "1px solid #d4af3744" }}
      >
        SC — Subcutaneous
      </span>
    );
  if (type === "IM")
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-sm font-medium"
        style={{ backgroundColor: "#E07B5433", color: "#E07B54", border: "1px solid #E07B5444" }}
      >
        IM — Intramuscular
      </span>
    );
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-sm font-medium"
      style={{ backgroundColor: "#7EB3A033", color: "#7EB3A0", border: "1px solid #7EB3A044" }}
    >
      SC or IM
    </span>
  );
}

// ─── Rotation diagram visual ─────────────────────────────────────────────────

function RotationDiagram() {
  const sites = [
    { label: "Abd R", x: 30, y: 50, color: "#d4af37" },
    { label: "Thigh R", x: 75, y: 50, color: "#7EB3A0" },
    { label: "Delt R", x: 120, y: 50, color: "#9B8EC4" },
    { label: "Glute R", x: 165, y: 50, color: "#E07B54" },
    { label: "Abd L", x: 30, y: 95, color: "#d4af37" },
    { label: "Thigh L", x: 75, y: 95, color: "#7EB3A0" },
    { label: "Delt L", x: 120, y: 95, color: "#9B8EC4" },
    { label: "Glute L", x: 165, y: 95, color: "#E07B54" },
  ];
  return (
    <svg viewBox="0 0 195 130" className="w-full max-w-xs" aria-label="8-site rotation diagram">
      <text x="97.5" y="14" textAnchor="middle" fontSize="7" fill="#A0A0A0" fontFamily="system-ui">
        8-SITE ROTATION (one suggested sequence)
      </text>
      {sites.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r="18" fill={s.color + "33"} stroke={s.color} strokeWidth="1.5" />
          <text x={s.x} y={s.y - 4} textAnchor="middle" fontSize="6" fill={s.color} fontWeight="700" fontFamily="system-ui">
            {i + 1}
          </text>
          <text x={s.x} y={s.y + 6} textAnchor="middle" fontSize="5.5" fill="#CCCCCC" fontFamily="system-ui">
            {s.label}
          </text>
        </g>
      ))}
      {/* Arrows connecting sequence */}
      {sites.map((s, i) => {
        if (i === sites.length - 1) return null;
        const next = sites[i + 1];
        return (
          <line
            key={`arrow-${i}`}
            x1={s.x + (i < 3 ? 18 : 18)}
            y1={s.y + (i === 3 ? 18 : 0)}
            x2={next.x - (i < 3 ? 18 : 18)}
            y2={next.y - (i === 3 ? 18 : 0)}
            stroke="#555"
            strokeWidth="1"
            strokeDasharray="3 2"
            markerEnd="url(#arrow)"
          />
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L0,4 L4,2 z" fill="#555" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function InjectionSiteDiagram() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zone = selectedZone ? ZONES[selectedZone] : null;

  const handleZoneClick = (id: string) => {
    setSelectedZone((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ backgroundColor: "#010101", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section className="px-6 pt-32 pb-12 md:pt-40 md:pb-16" style={{ backgroundColor: "#010101" }}>
        <div className="max-w-5xl mx-auto">
          <Breadcrumb
            variant="dark"
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Research Tools", href: "/tools" },
              { label: "Injection Site Diagram" },
            ]}
          />
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#C9DD69" }}>
            Research Tools
          </p>
          <h1
            className="text-4xl md:text-5xl mb-5 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9", lineHeight: 1.05 }}
          >
            Injection Site Diagram
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl"
            style={{ fontWeight: 300, color: "#A0A0A0", lineHeight: 1.65 }}
          >
            Interactive body diagram with needle length, angle, volume limits, and rotation advice
            for each injection zone. Click any highlighted area to view technique details.
          </p>
        </div>
      </section>

      {/* ── Main interactive section ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* ── Diagrams column ── */}
            <div>
              <div
                className="rounded-sm p-6 mb-5"
                style={{ backgroundColor: "#0C0C0C", border: "1px solid #1E1E1E" }}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{ color: "#A0A0A0" }}>
                      Front
                    </p>
                    <FrontBodySVG selectedZone={selectedZone} onZoneClick={handleZoneClick} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{ color: "#A0A0A0" }}>
                      Back
                    </p>
                    <BackBodySVG selectedZone={selectedZone} onZoneClick={handleZoneClick} />
                  </div>
                </div>
                <p className="text-xs text-center mt-4" style={{ color: "#555" }}>
                  Click a highlighted zone to view details
                </p>
              </div>

              {/* Zone legend */}
              <div
                className="rounded-sm p-5"
                style={{ backgroundColor: "#0C0C0C", border: "1px solid #1E1E1E" }}
              >
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#A0A0A0" }}>
                  Zones
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(ZONES).map((z) => (
                    <button
                      key={z.id}
                      onClick={() => handleZoneClick(z.id)}
                      className="flex items-center gap-2 rounded-sm px-3 py-2 text-left transition-all hover:opacity-80"
                      style={{
                        backgroundColor: selectedZone === z.id ? z.color + "22" : "#161616",
                        border: `1px solid ${selectedZone === z.id ? z.color : "#2A2A2A"}`,
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-3 h-3 rounded-full"
                        style={{ backgroundColor: z.color }}
                      />
                      <span className="text-xs" style={{ color: "#737373" }}>
                        {z.shortLabel}
                      </span>
                      <span
                        className="ml-auto text-xs"
                        style={{ color: "#555", fontSize: "10px" }}
                      >
                        {z.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Detail panel ── */}
            <div>
              {zone ? (
                <div
                  className="rounded-sm overflow-hidden"
                  style={{ border: `1px solid ${zone.color}44`, backgroundColor: "#0C0C0C" }}
                >
                  {/* Header */}
                  <div className="px-6 py-5" style={{ borderBottom: "1px solid #1E1E1E" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: zone.color }}
                      />
                      <h2 className="text-xl font-medium" style={{ color: "#F9F9F9" }}>
                        {zone.label}
                      </h2>
                    </div>
                    <TypeBadge type={zone.type} />
                  </div>

                  {/* Stats grid */}
                  <div
                    className="grid grid-cols-3 divide-x"
                    style={{ borderBottom: "1px solid #1E1E1E" }}
                  >
                    {[
                      { label: "Needle", value: zone.needleLength },
                      { label: "Angle", value: zone.angle },
                      { label: "Max Volume", value: zone.maxVolume },
                    ].map((s) => (
                      <div key={s.label} className="px-4 py-4" style={{ borderRight: "1px solid #1E1E1E" }}>
                        <p className="text-xs mb-1" style={{ color: "#555" }}>
                          {s.label}
                        </p>
                        <p className="text-sm font-medium" style={{ color: zone.color }}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Rotation advice */}
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-2"
                        style={{ color: zone.color }}
                      >
                        Rotation Advice
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "#C0C0C0" }}>
                        {zone.rotationAdvice}
                      </p>
                    </div>

                    {/* Technique steps */}
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{ color: zone.color }}
                      >
                        Technique
                      </p>
                      <ol className="space-y-2">
                        {zone.technique.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm" style={{ color: "#C0C0C0" }}>
                            <span
                              className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                              style={{ backgroundColor: zone.color + "22", color: zone.color }}
                            >
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Common mistakes */}
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{ color: "#E07B54" }}
                      >
                        Common Mistakes
                      </p>
                      <ul className="space-y-2">
                        {zone.commonMistakes.map((m, i) => (
                          <li key={i} className="flex gap-3 text-sm" style={{ color: "#C0C0C0" }}>
                            <span className="flex-shrink-0 mt-1" style={{ color: "#E07B54" }}>
                              ✕
                            </span>
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Commonly used compounds */}
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{ color: zone.color }}
                      >
                        Commonly Used Here
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {zone.compounds.map((c) => (
                          <span
                            key={c}
                            className="text-xs px-2 py-1 rounded-sm"
                            style={{
                              backgroundColor: zone.color + "15",
                              color: "#737373",
                              border: `1px solid ${zone.color}30`,
                            }}
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-sm p-8 flex flex-col items-center justify-center text-center"
                  style={{
                    backgroundColor: "#0C0C0C",
                    border: "1px solid #1E1E1E",
                    minHeight: "400px",
                  }}
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="mb-4"
                    style={{ color: "#333" }}
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <p className="text-base mb-2" style={{ color: "#555", fontWeight: 300 }}>
                    Select a zone to view details
                  </p>
                  <p className="text-sm" style={{ color: "#333" }}>
                    Click any highlighted area on the diagram or a zone button to see needle length, angle, volume limits, technique, and common mistakes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SC vs IM comparison ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl mb-2 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9" }}
          >
            SC vs IM: Key Differences
          </h2>
          <p className="text-sm mb-8" style={{ color: "#A0A0A0" }}>
            Most research peptides are administered subcutaneously (SC). Intramuscular (IM) is used for larger volumes or compounds requiring faster peak absorption.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {/* SC */}
            <div
              className="rounded-sm p-6"
              style={{ backgroundColor: "#0C0C0C", border: "1px solid #d4af3730" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#d4af37" }}
                />
                <p
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "#d4af37" }}
                >
                  Subcutaneous (SC)
                </p>
              </div>
              <div className="space-y-3 text-sm" style={{ color: "#C0C0C0" }}>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>Inject into the fatty layer between skin and muscle</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>29–31G × 4–6 mm insulin-type needle</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>45–90° angle depending on tissue thickness</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>Volume: up to 1 mL per injection site</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>Slower, sustained absorption — ideal for depot formation</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#d4af37" }}>•</span>
                  <span>Used by: BPC-157, TB-500, GHK-Cu, semaglutide, tirzepatide, ipamorelin, most peptides</span>
                </div>
              </div>
            </div>

            {/* IM */}
            <div
              className="rounded-sm p-6"
              style={{ backgroundColor: "#0C0C0C", border: "1px solid #E07B5430" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#E07B54" }}
                />
                <p
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "#E07B54" }}
                >
                  Intramuscular (IM)
                </p>
              </div>
              <div className="space-y-3 text-sm" style={{ color: "#C0C0C0" }}>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>Inject directly into muscle tissue</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>22–25G × 16–38 mm needle (length varies by site and tissue depth)</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>90° angle to skin surface</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>Volume: deltoid ≤1 mL; vastus lateralis ≤2 mL; ventrogluteal ≤3 mL</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>Faster absorption due to rich muscle vasculature</span>
                </div>
                <div className="flex gap-3">
                  <span style={{ color: "#E07B54" }}>•</span>
                  <span>Used for: large-volume injections (NAD+), some TB-500 protocols, or when SC volume limit is exceeded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8-site rotation guide ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-sm p-8"
            style={{ backgroundColor: "#0C0C0C", border: "1px solid #1E1E1E" }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "#C9DD69" }}
                >
                  Rotation Strategy
                </p>
                <h2
                  className="text-2xl mb-4 tracking-tight"
                  style={{ fontWeight: 200, color: "#F9F9F9" }}
                >
                  8-Site Rotation Protocol
                </h2>
                <p className="text-sm mb-4" style={{ color: "#A0A0A0", lineHeight: 1.7 }}>
                  For compounds requiring daily injection (BPC-157, ipamorelin, sermorelin, NAD+),
                  an 8-site rotation allows each site <strong style={{ color: "#F9F9F9" }}>7 days of recovery</strong> before re-use.
                </p>
                <ul className="space-y-2 text-sm" style={{ color: "#A0A0A0" }}>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>1.</span>
                    Right Abdomen
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>2.</span>
                    Right Anterior Thigh
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>3.</span>
                    Right Deltoid (if IM and low-volume)
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>4.</span>
                    Right Ventrogluteal (if IM)
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>5.</span>
                    Left Abdomen
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>6.</span>
                    Left Anterior Thigh
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>7.</span>
                    Left Deltoid
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9DD69" }}>8.</span>
                    Left Ventrogluteal
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <RotationDiagram />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Needle size reference ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl mb-6 tracking-tight"
            style={{ fontWeight: 200, color: "#F9F9F9" }}
          >
            Needle Size Reference
          </h2>
          <div
            className="rounded-sm overflow-hidden"
            style={{ border: "1px solid #1E1E1E" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#161616", borderBottom: "1px solid #2A2A2A" }}>
                  {["Gauge", "Length", "Route", "Best For", "Flow Rate"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-widest font-medium"
                      style={{ color: "#A0A0A0" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    gauge: "29–31G",
                    length: "4–6 mm",
                    route: "SC",
                    best: "All peptides, daily SC injections (BPC-157, ipamorelin, semaglutide)",
                    flow: "Slow — ideal for SC depot",
                  },
                  {
                    gauge: "27–28G",
                    length: "6–12 mm",
                    route: "SC",
                    best: "Slightly larger SC volumes (0.5–1 mL), subcutaneous belly fat",
                    flow: "Moderate",
                  },
                  {
                    gauge: "25–26G",
                    length: "16 mm (⅝\")",
                    route: "IM",
                    best: "Deltoid IM, thin patients, standard IM",
                    flow: "Moderate",
                  },
                  {
                    gauge: "23–24G",
                    length: "25 mm (1\")",
                    route: "IM",
                    best: "Thigh IM (vastus lateralis), average tissue depth",
                    flow: "Moderate–fast",
                  },
                  {
                    gauge: "21–22G",
                    length: "38 mm (1.5\")",
                    route: "IM",
                    best: "Ventrogluteal IM, large volume injections (NAD+), larger subjects",
                    flow: "Fast",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.gauge}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#0C0C0C" : "#0F0F0F",
                      borderBottom: "1px solid #1A1A1A",
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "#d4af37" }}>
                      {row.gauge}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#F9F9F9" }}>
                      {row.length}
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={row.route as InjectionType} />
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>
                      {row.best}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#A0A0A0" }}>
                      {row.flow}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* Catalog rail */}
          <ToolCatalogCTA className="py-2 mb-6" />

          <div
            className="rounded-sm p-6"
            style={{
              backgroundColor: "#0A0A0A",
              border: "1px solid #1E1E1E",
            }}
          >

            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#E07B54" }}
            >
              Research Use Only — Disclaimer
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>
              This diagram is intended for qualified researchers and educational reference only. All
              information is provided for in vitro / in vivo preclinical research study design. This
              tool does not constitute medical advice, clinical guidance, or instruction for human
              self-administration. Nexphoria products are sold strictly for laboratory research
              purposes and are not approved for human use, diagnosis, treatment, or prevention of
              any disease or condition.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Tools ── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-6" style={{ color: "#A0A0A0" }}>
            Related Tools
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                href: "/tools/dosing-frequency-planner",
                title: "Dosing Frequency Planner",
                desc: "Weekly injection schedule across multiple compounds.",
              },
              {
                href: "/tools/reconstitution-calculator",
                title: "Reconstitution Calculator",
                desc: "BAC water volume, dose volume, and doses per vial.",
              },
              {
                href: "/guides/dosing-protocols",
                title: "Dosing Protocol Design Guide",
                desc: "Loading phases, rotation, washout, and record-keeping.",
              },
              {
                href: "/tools/half-life-calculator",
                title: "Half-Life Calculator",
                desc: "Decay curves, clearance milestones, dosing frequency.",
              },
              {
                href: "/tools/peptide-timer",
                title: "Injection Timer",
                desc: "Live countdown to next dose for multiple compounds.",
              },
              {
                href: "/tools/protocol-template-generator",
                title: "Protocol Template Generator",
                desc: "Printable research protocol with schedule grid.",
              },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-sm p-5 group block transition-all hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#0C0C0C",
                  border: "1px solid #1E1E1E",
                  textDecoration: "none",
                }}
              >
                <p
                  className="text-sm font-medium mb-1 group-hover:opacity-70 transition-opacity"
                  style={{ color: "#F9F9F9" }}
                >
                  {t.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
                  {t.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
