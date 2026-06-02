import Link from "next/link";

interface PprLegalHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export default function PprLegalHero({ eyebrow, title, intro, effectiveDate, lastUpdated, version }: PprLegalHeroProps) {
  return (
    <header className="border-b pb-8" style={{ borderColor: "var(--steel)" }}>
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}
      >
        <Link href="/" className="transition-colors focus:outline-none focus-visible:underline" style={{ color: "var(--silver-2)" }}>
          Home
        </Link>
        <span aria-hidden="true" style={{ color: "var(--silver-3)" }}>
          /
        </span>
        <span style={{ color: "var(--silver-1)" }}>Legal</span>
      </nav>

      <p
        className="mb-3 text-[11px] uppercase"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.16em", color: "var(--accent)" }}
      >
        {eyebrow}
      </p>
      <h1
        className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--platinum)" }}
      >
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--silver-2)" }}>
        {intro}
      </p>

      <dl
        className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[12px]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
      >
        <div>
          <dt className="uppercase" style={{ letterSpacing: "0.1em", color: "var(--silver-3)" }}>
            Effective
          </dt>
          <dd className="mt-0.5" style={{ color: "var(--silver-1)" }}>
            <time dateTime={effectiveDate}>{formatDate(effectiveDate)}</time>
          </dd>
        </div>
        <div>
          <dt className="uppercase" style={{ letterSpacing: "0.1em", color: "var(--silver-3)" }}>
            Last updated
          </dt>
          <dd className="mt-0.5" style={{ color: "var(--silver-1)" }}>
            <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
          </dd>
        </div>
        <div>
          <dt className="uppercase" style={{ letterSpacing: "0.1em", color: "var(--silver-3)" }}>
            Version
          </dt>
          <dd className="mt-0.5" style={{ color: "var(--silver-1)" }}>
            v{version}
          </dd>
        </div>
      </dl>
    </header>
  );
}
