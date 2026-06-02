"use client";

/**
 * Pure-SVG mini charts — no charting library. Three variants: sparkline (line),
 * bar, and donut. Kept presentational and deterministic so they render the same
 * during static export and after hydration.
 */

interface SparklineProps {
  variant: "sparkline";
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

interface BarProps {
  variant: "bar";
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

interface DonutProps {
  variant: "donut";
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}

type PprAdminChartProps = SparklineProps | BarProps | DonutProps;

function Sparkline({ data, color = "var(--accent)", width = 120, height = 32, fill = false }: Omit<SparklineProps, "variant">) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1 || 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true" preserveAspectRatio="none" style={{ display: "block" }}>
      {fill && <path d={areaPath} fill={color} opacity={0.12} />}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function Bars({ data, color = "var(--accent)", width = 120, height = 40 }: Omit<BarProps, "variant">) {
  if (data.length === 0) return null;
  const max = Math.max(...data) || 1;
  const gap = 2;
  const barW = (width - gap * (data.length - 1)) / data.length;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden="true" style={{ display: "block" }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 2);
        const x = i * (barW + gap);
        const y = height - h;
        return <rect key={i} x={x} y={y} width={barW} height={h} rx={1} fill={color} opacity={0.85} />;
      })}
    </svg>
  );
}

function Donut({ segments, size = 96, thickness = 14 }: Omit<DonutProps, "variant">) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--steel)" strokeWidth={thickness} />
      {segments.map((seg, i) => {
        const frac = seg.value / total;
        const dash = frac * circumference;
        const el = (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function PprAdminChart(props: PprAdminChartProps) {
  if (props.variant === "sparkline") {
    const { variant: _v, ...rest } = props;
    return <Sparkline {...rest} />;
  }
  if (props.variant === "bar") {
    const { variant: _v, ...rest } = props;
    return <Bars {...rest} />;
  }
  const { variant: _v, ...rest } = props;
  return <Donut {...rest} />;
}
