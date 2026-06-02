"use client";

import { useMemo, useRef, useState } from "react";
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqItem } from "@/components/faq/faqData";
import PprFaqHero from "@/components/faq/PprFaqHero";
import PprFaqCategoryNav from "@/components/faq/PprFaqCategoryNav";
import PprFaqAccordion from "@/components/faq/PprFaqAccordion";
import PprFaqSearchResults from "@/components/faq/PprFaqSearchResults";
import PprFaqStillStuck from "@/components/faq/PprFaqStillStuck";

function matches(item: FaqItem, terms: string[]): boolean {
  const haystack = `${item.question} ${item.answer}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

export default function FaqClient() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(FAQ_CATEGORIES[0].id);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const trimmed = query.trim().toLowerCase();
  const isSearching = trimmed.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    const terms = trimmed.split(/\s+/).filter(Boolean);
    return FAQ_ITEMS.filter((item) => matches(item, terms));
  }, [isSearching, trimmed]);

  const itemsByCategory = useMemo(() => {
    const map: Record<string, FaqItem[]> = {};
    for (const cat of FAQ_CATEGORIES) {
      map[cat.id] = FAQ_ITEMS.filter((item) => item.category === cat.id);
    }
    return map;
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cat of FAQ_CATEGORIES) c[cat.id] = itemsByCategory[cat.id]?.length ?? 0;
    return c;
  }, [itemsByCategory]);

  const popular = useMemo(() => FAQ_ITEMS.filter((item) => item.popular).slice(0, 5), []);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const jumpToItem = (id: string) => {
    const item = FAQ_ITEMS.find((i) => i.id === id);
    if (item) setActiveCategory(item.category);
    setOpenId(id);
    requestAnimationFrame(() => {
      itemRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(`cat-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PprFaqHero query={query} onQueryChange={setQuery} popular={popular} onJump={jumpToItem} />

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {isSearching ? (
          <PprFaqSearchResults
            query={query.trim()}
            results={results}
            categories={FAQ_CATEGORIES}
            openId={openId}
            onToggle={toggle}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
            <aside>
              <PprFaqCategoryNav
                categories={FAQ_CATEGORIES}
                counts={counts}
                activeId={activeCategory}
                onSelect={selectCategory}
              />
            </aside>
            <div>
              <PprFaqAccordion
                categories={FAQ_CATEGORIES}
                itemsByCategory={itemsByCategory}
                openId={openId}
                onToggle={toggle}
                registerRef={(id, el) => {
                  itemRefs.current[id] = el;
                }}
              />
            </div>
          </div>
        )}
      </div>

      <PprFaqStillStuck />
    </>
  );
}
