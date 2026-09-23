"use client";

import { useState } from "react";
import type { PlanningCopy } from "@/lib/planning/copy";
import { formatCount, type HeroFigures } from "@/lib/planning/logic";

type Layer = "people" | "economy" | "syntax" | "carbon";
export type RunId = "task-8" | "task-9";

function layerReading(layer: Layer, copy: PlanningCopy, figures: HeroFigures): string {
  switch (layer) {
    case "people":
      return copy.peopleReading;
    case "economy":
      return figures.mixType && figures.industry && figures.mixType !== figures.industry
        ? copy.industryClash
        : copy.economyReading;
    case "syntax":
      return copy.syntaxReading;
    case "carbon":
      return copy.carbonReading;
    default: {
      const neverLayer: never = layer;
      return neverLayer;
    }
  }
}

function widthOf(value: number | null, max: number): string {
  if (value === null || max <= 0) return "0%";
  return `${Math.max(3, (value / max) * 100)}%`;
}

function wedgePath(cx: number, cy: number, r: number, start: number, end: number): string {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(start));
  const y0 = cy + r * Math.sin(rad(start));
  const x1 = cx + r * Math.cos(rad(end));
  const y1 = cy + r * Math.sin(rad(end));
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

export function AdvisoryPlanet({
  copy,
  figures,
  runId,
  onRun,
}: {
  copy: PlanningCopy;
  figures: HeroFigures;
  runId: RunId;
  onRun: (id: RunId) => void;
}) {
  const [layer, setLayer] = useState<Layer>("people");
  const peopleMax = Math.max(figures.visitors ?? 0, figures.usual ?? 0, 1);
  const useMax = Math.max(figures.retailCount ?? 0, figures.cateringCount ?? 0, figures.leisureCount ?? 0, figures.poi ?? 0, 1);
  const layers: { id: Layer; label: string }[] = [
    { id: "people", label: copy.layerPeople },
    { id: "economy", label: copy.layerEconomy },
    { id: "syntax", label: copy.layerSyntax },
    { id: "carbon", label: copy.layerCarbon },
  ];
  const runs: { id: RunId; label: string }[] = [
    { id: "task-8", label: copy.runErqi },
    { id: "task-9", label: copy.runUnresolved },
  ];
  const uses = [
    { value: figures.retailCount ?? 0, color: "#2dd4bf" },
    { value: figures.cateringCount ?? 0, color: "#ff4778" },
    { value: figures.leisureCount ?? 0, color: "#8b7cff" },
  ].filter((part) => part.value > 0);
  const useTotal = uses.reduce((sum, part) => sum + part.value, 0);
  let cursor = -90;
  const wedges = uses.map((part) => {
    const sweep = useTotal === 0 ? 0 : (part.value / useTotal) * 360;
    const start = cursor;
    cursor += sweep;
    return { ...part, d: wedgePath(200, 200, 112, start, cursor - 0.4) };
  });

  return (
    <div className="planet-layout">
      <div>
        <div className="planet-stage" data-layer={layer} data-run={runId}>
          <div className="planet-glow" aria-hidden />
          <svg viewBox="0 0 400 400" role="img" aria-label={copy.schematic}>
            <defs>
              <radialGradient id="advisory-globe" cx="36%" cy="32%" r="72%">
                <stop offset="0%" stopColor="#24584f" />
                <stop offset="48%" stopColor="#122421" />
                <stop offset="100%" stopColor="#070908" />
              </radialGradient>
              <clipPath id="advisory-clip">
                <circle cx="200" cy="200" r="112" />
              </clipPath>
            </defs>
            <ellipse className="planet-orbit" cx="200" cy="200" rx="158" ry="54" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            <ellipse className="planet-orbit is-b" cx="200" cy="200" rx="178" ry="70" fill="none" stroke="currentColor" strokeOpacity="0.22" />
            <circle cx="200" cy="200" r="112" fill="url(#advisory-globe)" />
            <g clipPath="url(#advisory-clip)" className="planet-uses" opacity={layer === "economy" ? 0.72 : 0.16}>
              {wedges.map((part) => (
                <path key={part.color} d={part.d} fill={part.color} />
              ))}
            </g>
            <g clipPath="url(#advisory-clip)" className="planet-streets" fill="none" stroke="#e7c27a" strokeLinecap="round">
              <circle cx="200" cy="200" r="78" strokeWidth="1.2" />
              <circle cx="200" cy="200" r="46" strokeWidth="1" />
              <path d="M200 92 V308" strokeWidth="1.3" />
              <path d="M92 200 H308" strokeWidth="1.3" />
              <path d="M124 124 L276 276" strokeWidth="1.1" />
              <path d="M276 124 L124 276" strokeWidth="1.1" />
              <path className="planet-spine" d="M118 214 C 160 168, 230 150, 292 186" strokeWidth="2.4" />
            </g>
            <circle cx="200" cy="200" r="112" fill="none" stroke="#f3efe6" strokeOpacity="0.18" />
          </svg>
        </div>
        <p className="mt-3 text-center font-mono text-[11px] text-muted">
          {figures.city} · {figures.district}
          <span className="mt-1 block">{copy.schematic}</span>
        </p>
      </div>
      <div>
        <div className="planet-layers" role="group" aria-label={copy.compareTitle}>
          {runs.map((item) => (
            <button key={item.id} type="button" aria-pressed={runId === item.id} onClick={() => onRun(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="planet-layers mt-2" role="group" aria-label={copy.planetTitle}>
          {layers.map((item) => (
            <button key={item.id} type="button" aria-pressed={layer === item.id} onClick={() => setLayer(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="planning-prose mt-4">{layerReading(layer, copy, figures)}</p>
        {layer === "people" ? (
          <div className="planet-meters">
            <Meter label={copy.visitors} value={figures.visitors} max={peopleMax} />
            <Meter label={copy.residents} value={figures.residents} max={peopleMax} />
            <Meter label={copy.workers} value={figures.workers} max={peopleMax} />
          </div>
        ) : null}
        {layer === "economy" ? (
          <div className="planet-meters">
            <Meter label={figures.mixType ?? figures.industry ?? copy.industry} value={figures.retailCount ?? figures.poi} max={useMax} />
            <Meter label={copy.industry} value={figures.poi} max={useMax} />
            <Meter label={figures.secondary ?? ""} value={figures.secondaryPoi} max={useMax} />
          </div>
        ) : null}
        {layer === "syntax" ? (
          <ul className="planet-meters text-sm text-secondary">
            <li>QGIS · boundary + centre lines</li>
            <li>depthmapX · 400 m · 800 m · 1200 m · n</li>
            <li>NAIN · NACH · {copy.notRun}</li>
          </ul>
        ) : null}
        {layer === "carbon" ? (
          <ul className="planet-meters text-sm text-secondary">
            <li>IF06 · {copy.statusNoData}</li>
            <li>IF07 · {copy.statusNoData}</li>
            <li>IF08 · {copy.statusNoData}</li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function Meter({ label, value, max }: { label: string; value: number | null; max: number }) {
  return (
    <div className="planet-meter">
      <span>
        <b className="font-sans font-medium text-fg">{label}</b>
        <b className="font-mono text-[11px] font-normal text-muted">{value === null ? "—" : formatCount(value)}</b>
      </span>
      <i>
        <b style={{ width: widthOf(value, max) }} />
      </i>
    </div>
  );
}
