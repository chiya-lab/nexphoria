interface ToolEstimateNoteProps {
  className?: string;
  /** Override the default label text if a tool needs more specific framing. */
  label?: string;
}

/**
 * Small inline banner that frames a tool's computed output as a research-planning
 * estimate rather than guidance. Place directly above or inside a results block.
 * Presentational only.
 */
export default function ToolEstimateNote({
  className = "",
  label = "Research-use estimate — for research planning purposes only.",
}: ToolEstimateNoteProps) {
  return (
    <p
      className={`text-xs uppercase tracking-widest ${className}`}
      style={{ color: "#7A8A60", letterSpacing: "0.12em" }}
    >
      {label}
    </p>
  );
}
