// Protocols-teaser data. `skus` are display chips; `monthlySubPrice` is the
// subscribe-cadence per-shipment price for the bundle.

export interface MockProtocol {
  slug: string;
  name: string;
  durationDays: number;
  skus: string[];
  monthlySubPrice: number;
}

export const mockProtocols: MockProtocol[] = [
  {
    slug: "recovery-90",
    name: "Recovery 90",
    durationDays: 90,
    skus: ["BPC-157", "TB-500"],
    monthlySubPrice: 94,
  },
  {
    slug: "metabolic-90",
    name: "Metabolic 90",
    durationDays: 90,
    skus: ["Semaglutide", "AOD-9604"],
    monthlySubPrice: 128,
  },
  {
    slug: "dermal-glow-90",
    name: "Dermal Glow 90",
    durationDays: 90,
    skus: ["GHK-Cu", "Epitalon"],
    monthlySubPrice: 84,
  },
];
