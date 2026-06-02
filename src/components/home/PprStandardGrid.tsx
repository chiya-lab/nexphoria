import { FlaskConical, Hexagon, Snowflake, MapPin } from "lucide-react";

const TILES = [
  {
    Icon: FlaskConical,
    title: "HPLC tested",
    body: "Reverse-phase HPLC and ESI-MS identity confirmation on every production lot.",
  },
  {
    Icon: Hexagon,
    title: "99%+ purity",
    body: "Catalog compounds held to a 99%+ purity threshold, verified independently.",
  },
  {
    Icon: Snowflake,
    title: "Cold-chain shipped",
    body: "Gel-packed sub-8°C transit protects lyophilized material end to end.",
  },
  {
    Icon: MapPin,
    title: "US-fulfilled",
    body: "Domestic fulfillment with lot-specific documentation enclosed per order.",
  },
];

export default function PprStandardGrid() {
  return (
    <section className="px-6 py-20 md:py-28" style={{ backgroundColor: "var(--ink)" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg p-6"
              style={{ backgroundColor: "var(--ink-2)", border: "1px solid var(--steel)" }}
            >
              <Icon size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} aria-hidden="true" />
              <h3
                className="mt-4"
                style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--platinum)", lineHeight: 1.2 }}
              >
                {title}
              </h3>
              <p
                className="mt-2 text-[14px]"
                style={{ fontFamily: "var(--font-body)", color: "var(--silver-2)", lineHeight: 1.55 }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
