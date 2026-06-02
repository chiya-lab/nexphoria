"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Globe,
  ShieldCheck,
  RefreshCw,
  FileText,
} from "lucide-react";

import {
  MOCK_QUEUE,
  COMPLIANCE_CHECKS,
  STATUS_LABELS,
  STATUS_COLORS,
  SOURCE_LABELS,
  OUTCOME_COLORS,
  checksForSource,
  queueDepth,
  deriveRecommendedStatus,
  canTransition,
  type TestimonialSubmission,
  type TestimonialStatus,
  type ComplianceCheckId,
  type ComplianceOutcome,
} from "@/lib/testimonials";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: TestimonialStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      {status === "pending" && <Clock size={10} />}
      {status === "under_review" && <Eye size={10} />}
      {status === "approved" && <CheckCircle size={10} />}
      {status === "rejected" && <XCircle size={10} />}
      {status === "flagged" && <AlertTriangle size={10} />}
      {status === "published" && <Globe size={10} />}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Compliance Checklist Row ─────────────────────────────────────────────────

function ChecklistRow({
  checkId,
  label,
  description,
  severity,
  outcome,
  note,
  editable,
  onOutcomeChange,
  onNoteChange,
}: {
  checkId: ComplianceCheckId;
  label: string;
  description: string;
  severity: "critical" | "high" | "medium";
  outcome: ComplianceOutcome;
  note?: string;
  editable: boolean;
  onOutcomeChange: (id: ComplianceCheckId, outcome: ComplianceOutcome) => void;
  onNoteChange: (id: ComplianceCheckId, note: string) => void;
}) {
  const oc = OUTCOME_COLORS[outcome];
  const sevColor =
    severity === "critical" ? "#DC2626" : severity === "high" ? "#D97706" : "#6B7280";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: 12,
        padding: "14px 0",
        borderBottom: "1px solid #F0EDEA",
        alignItems: "start",
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: sevColor,
              background: sevColor + "14",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {severity}
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#111" }}>{label}</span>
        </div>
        <p style={{ fontSize: "0.72rem", color: "#666", lineHeight: 1.55, marginBottom: 8 }}>
          {description}
        </p>
        {editable ? (
          <textarea
            value={note ?? ""}
            onChange={(e) => onNoteChange(checkId, e.target.value)}
            placeholder="Reviewer note (optional)…"
            rows={2}
            style={{
              width: "100%",
              fontSize: "0.72rem",
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #E0DCDA",
              color: "#333",
              resize: "vertical",
              fontFamily: "inherit",
              background: "#FAFAF9",
            }}
          />
        ) : note ? (
          <p
            style={{
              fontSize: "0.72rem",
              color: "#555",
              background: "#F7F5F2",
              padding: "6px 8px",
              borderRadius: 6,
              fontStyle: "italic",
            }}
          >
            {note}
          </p>
        ) : null}
      </div>

      {editable ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(["pass", "fail", "needs_review", "na"] as ComplianceOutcome[]).map((o) => (
            <label
              key={o}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: "0.75rem",
                cursor: "pointer",
                color: outcome === o ? OUTCOME_COLORS[o].text : "#777",
                fontWeight: outcome === o ? 600 : 400,
              }}
            >
              <input
                type="radio"
                name={`check-${checkId}`}
                value={o}
                checked={outcome === o}
                onChange={() => onOutcomeChange(checkId, o)}
                style={{ accentColor: OUTCOME_COLORS[o].text }}
              />
              <span style={{ color: OUTCOME_COLORS[o].text, fontWeight: 700 }}>
                {OUTCOME_COLORS[o].icon}
              </span>
              {o === "needs_review" ? "Needs review" : o.charAt(0).toUpperCase() + o.slice(1)}
            </label>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: "flex-end",
          }}
        >
          <span style={{ fontSize: "1rem", color: oc.text, fontWeight: 700 }}>
            {oc.icon}
          </span>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: oc.text, textTransform: "capitalize" }}>
            {outcome === "needs_review" ? "Needs Review" : outcome === "na" ? "N/A" : outcome.charAt(0).toUpperCase() + outcome.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Submission Detail Panel ──────────────────────────────────────────────────

function SubmissionDetail({
  submission,
  onUpdate,
}: {
  submission: TestimonialSubmission;
  onUpdate: (updated: TestimonialSubmission) => void;
}) {
  const isEditable =
    submission.status === "pending" || submission.status === "under_review" || submission.status === "flagged";

  const applicableChecks = checksForSource(submission.source);

  // Local state for edits
  const [results, setResults] = useState(
    () =>
      applicableChecks.map((check) => {
        const existing = submission.complianceResults.find((r) => r.checkId === check.id);
        return {
          checkId: check.id,
          outcome: existing?.outcome ?? ("na" as ComplianceOutcome),
          note: existing?.note ?? "",
        };
      }),
  );
  const [reviewerNote, setReviewerNote] = useState(submission.reviewerNote ?? "");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const recommended = deriveRecommendedStatus(results, submission.source);

  function handleOutcomeChange(id: ComplianceCheckId, outcome: ComplianceOutcome) {
    setResults((prev) => prev.map((r) => (r.checkId === id ? { ...r, outcome } : r)));
  }

  function handleNoteChange(id: ComplianceCheckId, note: string) {
    setResults((prev) => prev.map((r) => (r.checkId === id ? { ...r, note } : r)));
  }

  function handleSave(targetStatus: TestimonialStatus) {
    if (!canTransition(submission.status, targetStatus)) return;
    setSaving(true);
    setTimeout(() => {
      onUpdate({
        ...submission,
        status: targetStatus,
        complianceResults: results,
        reviewerNote,
        reviewedAt: new Date().toISOString(),
        assignedTo: submission.assignedTo ?? "compliance-reviewer-1",
      });
      setSaving(false);
      setSavedMsg(`Saved as ${STATUS_LABELS[targetStatus]}`);
      setTimeout(() => setSavedMsg(""), 3000);
    }, 400);
  }

  const transitionTargets = [
    ...(isEditable ? (["approved", "rejected", "flagged"] as TestimonialStatus[]) : []),
    ...(submission.status === "approved" ? (["published"] as TestimonialStatus[]) : []),
  ].filter((t) => canTransition(submission.status, t));

  const transitionColors: Record<string, string> = {
    approved: "#16A34A",
    rejected: "#DC2626",
    flagged: "#D97706",
    published: "#0284C7",
    under_review: "#2563EB",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
      {/* Submission header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #EBEBEB",
          background: "#FAFAF9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <StatusBadge status={submission.status} />
            <span
              style={{
                fontSize: "0.68rem",
                color: "#999",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {SOURCE_LABELS[submission.source]}
            </span>
            <span style={{ fontSize: "0.68rem", color: "#BBB" }}>·</span>
            <span style={{ fontSize: "0.68rem", color: "#999" }}>{fmtDate(submission.submittedAt)}</span>
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111", marginBottom: 2 }}>
            {submission.submitterName}
          </p>
          {submission.submitterAffiliation && (
            <p style={{ fontSize: "0.75rem", color: "#777" }}>{submission.submitterAffiliation}</p>
          )}
        </div>
        <div style={{ fontSize: "0.68rem", color: "#999", textAlign: "right" }}>
          <span style={{ display: "block" }}>ID: {submission.id}</span>
          {submission.verifiedOrderId && (
            <span style={{ display: "block", color: "#16A34A", fontWeight: 500 }}>
              Order: {submission.verifiedOrderId}
            </span>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {/* Raw quote */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#999",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Raw Submission
          </p>
          <blockquote
            style={{
              margin: 0,
              padding: "14px 16px",
              borderLeft: "3px solid #E0DCDA",
              background: "#F7F5F2",
              borderRadius: "0 8px 8px 0",
              fontSize: "0.85rem",
              color: "#333",
              lineHeight: 1.65,
              fontStyle: "italic",
            }}
          >
            &ldquo;{submission.rawQuote}&rdquo;
          </blockquote>

          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {submission.productNames.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 8px",
                  borderRadius: 99,
                  background: "#F0EDEA",
                  color: "#555",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Compliance checklist */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#999",
                fontWeight: 600,
              }}
            >
              Compliance Screening
            </p>
            {isEditable && (
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "#2563EB",
                  background: "#EFF6FF",
                  padding: "2px 8px",
                  borderRadius: 99,
                  fontWeight: 600,
                }}
              >
                Recommended: {STATUS_LABELS[recommended]}
              </span>
            )}
          </div>

          {applicableChecks.map((check) => {
            const result = results.find((r) => r.checkId === check.id)!;
            return (
              <ChecklistRow
                key={check.id}
                checkId={check.id}
                label={check.label}
                description={check.description}
                severity={check.severity}
                outcome={result.outcome}
                note={result.note}
                editable={isEditable}
                onOutcomeChange={handleOutcomeChange}
                onNoteChange={handleNoteChange}
              />
            );
          })}
        </div>

        {/* Reviewer note */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#999",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Reviewer Decision Note
          </p>
          {isEditable ? (
            <textarea
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Summarise the compliance decision and any caveats…"
              rows={3}
              style={{
                width: "100%",
                fontSize: "0.8rem",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #E0DCDA",
                color: "#333",
                resize: "vertical",
                fontFamily: "inherit",
                background: "#FAFAF9",
              }}
            />
          ) : reviewerNote ? (
            <p
              style={{
                fontSize: "0.8rem",
                color: "#444",
                background: "#F7F5F2",
                padding: "10px 12px",
                borderRadius: 8,
                lineHeight: 1.6,
              }}
            >
              {reviewerNote}
            </p>
          ) : (
            <p style={{ fontSize: "0.78rem", color: "#BBB", fontStyle: "italic" }}>
              No reviewer note recorded.
            </p>
          )}
        </div>

        {/* Publication info */}
        {submission.status === "published" && submission.publishedTo && (
          <div
            style={{
              padding: "12px 14px",
              background: "#F0F9FF",
              borderRadius: 8,
              border: "1px solid #BAE6FD",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#0284C7", marginBottom: 4 }}>
              Published to
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {submission.publishedTo.map((loc) => (
                <span
                  key={loc}
                  style={{
                    fontSize: "0.68rem",
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: "#E0F2FE",
                    color: "#0369A1",
                    textTransform: "capitalize",
                  }}
                >
                  {loc.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            {submission.publishedAt && (
              <p style={{ fontSize: "0.68rem", color: "#7EA8C1", marginTop: 6 }}>
                Published {fmtDate(submission.publishedAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action bar */}
      {transitionTargets.length > 0 && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #EBEBEB",
            background: "#FAFAF9",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {transitionTargets.map((target) => (
            <button
              key={target}
              onClick={() => handleSave(target)}
              disabled={saving}
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                border: `1px solid ${transitionColors[target] ?? "#888"}`,
                background:
                  target === "rejected"
                    ? "#FEF2F2"
                    : target === "flagged"
                    ? "#FFFBEB"
                    : target === "published"
                    ? "#EFF6FF"
                    : transitionColors[target] + "14",
                color: transitionColors[target] ?? "#555",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {target === "approved" && <CheckCircle size={13} />}
              {target === "rejected" && <XCircle size={13} />}
              {target === "flagged" && <AlertTriangle size={13} />}
              {target === "published" && <Globe size={13} />}
              {STATUS_LABELS[target]}
            </button>
          ))}
          {savedMsg && (
            <span style={{ fontSize: "0.75rem", color: "#16A34A", fontWeight: 500 }}>
              {savedMsg}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Queue Row ────────────────────────────────────────────────────────────────

function QueueRow({
  submission,
  selected,
  onClick,
}: {
  submission: TestimonialSubmission;
  selected: boolean;
  onClick: () => void;
}) {
  const snippet = submission.rawQuote.slice(0, 90) + (submission.rawQuote.length > 90 ? "…" : "");

  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid #F0EDEA",
        cursor: "pointer",
        background: selected ? "#F5F0EA" : "transparent",
        borderLeft: selected ? "3px solid #B8923A" : "3px solid transparent",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StatusBadge status={submission.status} />
          <span style={{ fontSize: "0.65rem", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {SOURCE_LABELS[submission.source]}
          </span>
        </div>
        <span style={{ fontSize: "0.65rem", color: "#CCC" }}>{fmtDate(submission.submittedAt)}</span>
      </div>
      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#222", marginBottom: 2 }}>
        {submission.submitterName}
      </p>
      <p style={{ fontSize: "0.72rem", color: "#888", lineHeight: 1.45, fontStyle: "italic" }}>
        &ldquo;{snippet}&rdquo;
      </p>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ queue }: { queue: TestimonialSubmission[] }) {
  const counts = (["pending", "under_review", "flagged", "approved", "rejected", "published"] as TestimonialStatus[]).map(
    (s) => ({ status: s, count: queue.filter((q) => q.status === s).length }),
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #E8E5DF",
        background: "#FFFFFF",
      }}
    >
      {counts.map(({ status, count }) => {
        const c = STATUS_COLORS[status];
        return (
          <div
            key={status}
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRight: "1px solid #F0EDEA",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                color: count > 0 ? c.text : "#CCC",
                fontFamily: "var(--font-display)",
                lineHeight: 1,
                marginBottom: 3,
              }}
            >
              {count}
            </div>
            <div style={{ fontSize: "0.6rem", color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {STATUS_LABELS[status]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const ALL_STATUSES: TestimonialStatus[] = [
  "pending", "under_review", "flagged", "approved", "rejected", "published",
];

function FilterBar({
  activeStatus,
  onStatusChange,
}: {
  activeStatus: TestimonialStatus | "all";
  onStatusChange: (s: TestimonialStatus | "all") => void;
}) {
  const filters: Array<{ value: TestimonialStatus | "all"; label: string }> = [
    { value: "all", label: "All" },
    ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: "12px 16px",
        borderBottom: "1px solid #F0EDEA",
        overflowX: "auto",
      }}
    >
      {filters.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onStatusChange(value)}
          style={{
            padding: "5px 12px",
            borderRadius: 99,
            border: "1px solid",
            borderColor: activeStatus === value ? "#B8923A" : "#E0DCDA",
            background: activeStatus === value ? "#B8923A" : "transparent",
            color: activeStatus === value ? "#FFFFFF" : "#777",
            fontSize: "0.7rem",
            fontWeight: activeStatus === value ? 600 : 400,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestimonialsReviewPage() {
  const [queue, setQueue] = useState<TestimonialSubmission[]>(MOCK_QUEUE);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_QUEUE[0]?.id ?? null);
  const [filterStatus, setFilterStatus] = useState<TestimonialStatus | "all">("all");

  const filteredQueue = useMemo(
    () =>
      filterStatus === "all"
        ? queue
        : queue.filter((s) => s.status === filterStatus),
    [queue, filterStatus],
  );

  const selected = queue.find((s) => s.id === selectedId) ?? null;

  function handleUpdate(updated: TestimonialSubmission) {
    setQueue((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F5F2",
        fontFamily: "var(--font-inter, sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0A0A0A",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ShieldCheck size={18} color="#B8A44C" />
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            Nexphoria / Testimonial Review
          </span>
          {queueDepth(queue) > 0 && (
            <span
              style={{
                background: "#DC2626",
                color: "#FFF",
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              {queueDepth(queue)} needs review
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={13} color="#666" />
          <span style={{ fontSize: "0.65rem", color: "#666", letterSpacing: "0.1em" }}>
            INTERNAL · Compliance Review Queue
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <StatsBar queue={queue} />

      {/* Compliance policy note */}
      <div
        style={{
          background: "#FFFBEB",
          borderBottom: "1px solid #FDE68A",
          padding: "10px 24px",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <AlertTriangle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: "0.72rem", color: "#92400E", lineHeight: 1.5 }}>
          <strong>Compliance Policy:</strong> All testimonials must pass the screening checklist before publishing.
          Critical failures (personal health claims, therapeutic implication, human dosing) result in automatic
          rejection. Flagged items require sign-off from the legal/compliance team.
          Influencer submissions additionally require written FTC disclosure on file.
          Published testimonials may only be retracted by a platform admin.
        </p>
      </div>

      {/* Main layout: queue list + detail panel */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Left: queue list */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            borderRight: "1px solid #E8E5DF",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <FilterBar activeStatus={filterStatus} onStatusChange={setFilterStatus} />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredQueue.length === 0 ? (
              <div
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: "#CCC",
                  fontSize: "0.8rem",
                }}
              >
                No submissions in this status.
              </div>
            ) : (
              filteredQueue.map((s) => (
                <QueueRow
                  key={s.id}
                  submission={s}
                  selected={selectedId === s.id}
                  onClick={() => setSelectedId(s.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        <div style={{ flex: 1, background: "#FFFFFF", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {selected ? (
            <SubmissionDetail
              key={selected.id}
              submission={selected}
              onUpdate={handleUpdate}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#CCC",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <FileText size={36} />
              <p style={{ fontSize: "0.85rem" }}>Select a submission to review</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #E8E5DF",
          padding: "10px 24px",
          background: "#FAFAF9",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.6rem",
            color: "#AAA",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Internal compliance tool — not for customer view · Nexphoria Admin · All reviews are for research compounds only
        </p>
      </div>
    </div>
  );
}
