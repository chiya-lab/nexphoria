import Link from "next/link";

interface ToolCatalogCTAProps {
  className?: string;
  /** Optional secondary line under the CTA (e.g. a contextual FAQ link). */
  children?: React.ReactNode;
}

/**
 * Shared "browse the catalog" call-to-action used at the foot of research tools.
 * Links researchers from a planning tool back to the verified compound catalog.
 * Presentational only.
 */
export default function ToolCatalogCTA({ className = "", children }: ToolCatalogCTAProps) {
  return (
    <div className={`text-center ${className}`}>
      <Link href="/products" className="btn-primary inline-block">
        Browse Research Catalog
      </Link>
      <p className="text-xs mt-4" style={{ color: "#737373" }}>
        Every compound ships as lyophilized powder with a lot-specific COA from an
        independent laboratory.
      </p>
      {children}
    </div>
  );
}
