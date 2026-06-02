export interface PolicyFaqItem {
  q: string;
  a: string;
}

export const POLICY_FAQ: PolicyFaqItem[] = [
  {
    q: "Which carriers do you use?",
    a: "We ship via major domestic carriers selected per service level — ground for Standard, and overnight networks for Expedited and Priority. The carrier and tracking number are confirmed by email when the label is scanned.",
  },
  {
    q: "What happens if my package is lost in transit?",
    a: "Check the tracking link first; carriers occasionally scan late. If the package is still missing 24 hours past the expected delivery, contact research support and we will open a carrier trace. Confirmed lost shipments are reshipped at no additional charge.",
  },
  {
    q: "My order arrived damaged — what should I do?",
    a: "Photograph the outer box, the tamper-evident seal, and the vials as received, then contact research support within 48 hours of delivery with your order number and images. Verified transit damage is replaced at no cost.",
  },
  {
    q: "Can I change my shipping address after ordering?",
    a: "If the order has not yet been dispatched, contact research support promptly and we will update the destination. Once a label is scanned by the carrier, the address can no longer be changed.",
  },
  {
    q: "Is a signature required on delivery?",
    a: "Overnight and Expedited shipments require an adult signature by default so temperature-sensitive lots are received promptly. If no one is available, the carrier leaves a pickup notice.",
  },
  {
    q: "Do you ship internationally?",
    a: "No. We ship within the contiguous United States only and do not ship to Alaska, Hawaii, US territories, or international destinations at this time. A valid US research or business address is required.",
  },
];
