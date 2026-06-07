"use client";

import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

export default function LegalToc({
  items,
  variant = "dark",
  title = "On this page",
}: {
  items: TocItem[];
  variant?: "dark" | "light";
  title?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const colors =
    variant === "dark"
      ? {
          heading: "#6B6B6B",
          link: "#8A8A8A",
          linkActive: "#d4af37",
          rail: "rgba(255,255,255,0.10)",
          railActive: "#d4af37",
        }
      : {
          heading: "#7A6B2A",
          link: "#666666",
          linkActive: "#1A1A1A",
          rail: "rgba(0,0,0,0.10)",
          railActive: "#B8A44C",
        };

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  }

  return (
    <nav aria-label={title} className="text-sm">
      <p
        className="text-[10px] uppercase font-medium tracking-widest mb-4"
        style={{ color: colors.heading, letterSpacing: "0.2em" }}
      >
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
                className="block py-1.5 pl-3 leading-snug transition-colors duration-200"
                style={{
                  color: isActive ? colors.linkActive : colors.link,
                  borderLeft: `2px solid ${
                    isActive ? colors.railActive : colors.rail
                  }`,
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
