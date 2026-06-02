"use client";

import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    items.length > 0 ? items[0].id : null
  );

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  }

  if (items.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p
        className="text-xs uppercase tracking-widest mb-4"
        style={{ color: "#B8A44C" }}
      >
        On this page
      </p>
      <ul className="space-y-2.5">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} style={{ paddingLeft: item.level === 3 ? "0.75rem" : 0 }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className="block leading-snug transition-colors"
                style={{
                  color: isActive ? "#010101" : "#888",
                  fontWeight: isActive ? 500 : 300,
                  borderLeft: isActive
                    ? "2px solid #B8A44C"
                    : "2px solid transparent",
                  paddingLeft: "0.75rem",
                  marginLeft: "-0.75rem",
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
