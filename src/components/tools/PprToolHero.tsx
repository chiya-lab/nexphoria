import Link from "next/link";

/** Compact page header shared across the /tools/* sub-routes. */
export default function PprToolHero({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <header className="ppr-grid-hex px-6 pb-12 pt-32 md:pt-40">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/tools"
          className="text-[12px] uppercase transition-colors hover:text-[color:var(--platinum)]"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--silver-2)" }}
        >
          &larr; All tools
        </Link>
        <p
          className="mt-6 text-[12px] uppercase"
          style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
        >
          {eyebrow}
        </p>
        <h1
          className="mt-3"
          style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.05 }}
        >
          {title}
        </h1>
        <p
          className="mt-4 max-w-[560px] text-[16px]"
          style={{ fontFamily: "var(--font-body)", color: "var(--silver-1)", lineHeight: 1.55 }}
        >
          {sub}
        </p>
      </div>
    </header>
  );
}
