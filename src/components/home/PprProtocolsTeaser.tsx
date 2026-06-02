import Link from "next/link";
import { mockProtocols } from "@/lib/mock-protocols";

export default function PprProtocolsTeaser() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink-2)" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="text-[12px] uppercase"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.18em", color: "var(--accent)" }}
            >
              Protocols
            </p>
            <h2
              className="mt-3"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Pre-composed 90-day protocols.
            </h2>
          </div>
          <Link
            href="/quiz"
            className="hidden items-center gap-1 text-[14px] transition-colors hover:text-[color:var(--accent)] md:inline-flex"
            style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }}
          >
            Build your own <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {mockProtocols.map((protocol) => (
            <div
              key={protocol.slug}
              className="flex flex-col rounded-lg p-6"
              style={{ backgroundColor: "var(--ink-3)", border: "1px solid var(--steel)" }}
            >
              <div className="flex items-baseline justify-between">
                <h3
                  style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.15 }}
                >
                  {protocol.name}
                </h3>
                <span
                  className="text-[12px]"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}
                >
                  {protocol.durationDays} days
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {protocol.skus.map((sku) => (
                  <span
                    key={sku}
                    className="rounded-full px-3 py-1 text-[12px]"
                    style={{ fontFamily: "var(--font-mono)", border: "1px solid var(--steel)", color: "var(--silver-1)" }}
                  >
                    {sku}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <p className="text-[13px]" style={{ fontFamily: "var(--font-mono)", color: "var(--silver-2)" }}>
                  <span style={{ color: "var(--platinum)", fontSize: 20 }}>${protocol.monthlySubPrice}</span>
                  /month subscribe
                </p>
                <Link
                  href="/quiz"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--accent)", color: "var(--ink)", fontFamily: "var(--font-display)" }}
                >
                  Start protocol <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
