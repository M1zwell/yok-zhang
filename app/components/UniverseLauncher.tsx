"use client";

import { useMemo, useRef, useState } from "react";
import { tools } from "@/lib/site";

const groups = [
  { id: "all", label: "All" },
  { id: "worlds", label: "Worlds" },
  { id: "dseek", label: "dseek" },
  { id: "jubit", label: "Jubit" },
  { id: "also", label: "Also live" },
];

export function UniverseLauncher() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("all");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tools.filter((t) => {
      const inGroup = group === "all" || t.group === group;
      const hit =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.path.toLowerCase().includes(query) ||
        (t.note ?? "").toLowerCase().includes(query);
      return inGroup && hit;
    });
  }, [q, group]);

  return (
    <div className="card p-5 sm:p-6">
      <p className="kicker">Universe launcher</p>
      <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">Jump a live app</h2>
      <p className="mt-2 text-sm text-muted">
        Filter the surfaces that actually run. Keyboard: type, ↑↓, Enter.
      </p>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((n) => Math.min(n + 1, list.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((n) => Math.max(n - 1, 0));
          } else if (e.key === "Enter" && list[active]) {
            window.open(list[active].href, "_blank", "noopener,noreferrer");
          }
        }}
        placeholder="Search jubit, dseek, gghere…"
        className="mt-5 w-full rounded-xl border border-hair bg-bg px-3 py-2.5 text-sm text-fg outline-none placeholder:text-muted focus:border-accent/50"
        aria-label="Search live apps"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => {
              setGroup(g.id);
              setActive(0);
            }}
            className={`tag-chip ${group === g.id ? "is-on" : ""}`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <ul className="mt-4 divide-y divide-hair" role="listbox" aria-label="Live apps">
        {list.map((tool, i) => {
          const on = i === active;
          return (
            <li key={tool.id}>
              <a
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setActive(i)}
                className={
                  on
                    ? "flex items-baseline justify-between gap-3 bg-accent/10 px-2 py-3"
                    : "flex items-baseline justify-between gap-3 px-2 py-3 hover:bg-elevated"
                }
                aria-selected={on}
                role="option"
              >
                <span>
                  <span className="block font-display text-lg text-fg">{tool.title}</span>
                  {tool.note ? (
                    <span className="mt-1 block max-w-md text-[12px] leading-relaxed text-muted">
                      {tool.note}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-accent">
                  {tool.path} ↗
                </span>
              </a>
            </li>
          );
        })}
        {list.length === 0 ? (
          <li className="px-2 py-6 text-sm text-muted">No apps match.</li>
        ) : null}
      </ul>
    </div>
  );
}
