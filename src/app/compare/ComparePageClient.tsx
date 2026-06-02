"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-products";
import PprCompareHero from "@/components/compare/PprCompareHero";
import PprCompareSelector from "@/components/compare/PprCompareSelector";
import PprCompareTable from "@/components/compare/PprCompareTable";
import PprCompareKeyDiffs from "@/components/compare/PprCompareKeyDiffs";
import PprCompareShare from "@/components/compare/PprCompareShare";
import PprCompareCta from "@/components/compare/PprCompareCta";

const MAX_SLOTS = 4;

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  const valid = new Set(MOCK_PRODUCTS.map((p) => p.slug));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (valid.has(slug) && !seen.has(slug)) {
      seen.add(slug);
      out.push(slug);
    }
    if (out.length >= MAX_SLOTS) break;
  }
  return out;
}

export default function ComparePageClient({ initialIds }: { initialIds: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefer the live ?ids= param (client navigation / shared link); fall back to
  // the server-provided initial value for the first paint.
  const [slugs, setSlugs] = useState<string[]>(() =>
    parseIds(initialIds || (searchParams?.get("ids") ?? null)),
  );

  // Keep the URL in sync so the comparison is shareable / bookmarkable.
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    if (slugs.length > 0) {
      params.set("ids", slugs.join(","));
    } else {
      params.delete("ids");
    }
    const qs = params.toString();
    router.replace(qs ? `/compare?${qs}` : "/compare", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs]);

  const products = useMemo<MockProduct[]>(() => {
    const bySlug = new Map(MOCK_PRODUCTS.map((p) => [p.slug, p]));
    return slugs.map((s) => bySlug.get(s)).filter((p): p is MockProduct => p !== undefined);
  }, [slugs]);

  const addSlug = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) || prev.length >= MAX_SLOTS ? prev : [...prev, slug]));
  }, []);

  const removeSlug = useCallback((slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  return (
    <>
      <PprCompareSelector selected={products} onAdd={addSlug} onRemove={removeSlug} />
      <PprCompareTable products={products} onRemove={removeSlug} />
      <PprCompareKeyDiffs products={products} />
      <PprCompareShare products={products} />
      <PprCompareCta products={products} />
    </>
  );
}
