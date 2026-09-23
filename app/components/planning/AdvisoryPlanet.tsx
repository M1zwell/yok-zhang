"use client";

import { useState } from "react";
import type { PlanningCopy } from "@/lib/planning/copy";
import { formatCount, type HeroFigures } from "@/lib/planning/logic";

type Layer = "people" | "economy" | "syntax" | "carbon";

function layerReading(layer: Layer, copy: PlanningCopy): string {
  switch (layer) {
    case "people":
      return copy.peopleReading;
    case "economy":
      return copy.economyReading;
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

export function AdvisoryPlanet({ copy, figures }: { copy: PlanningCopy; figures: HeroFigures }) {
  const [layer, setLayer] = useState<Layer>("people");
  const peopleMax = Math.max(figures.visitors ?? 0, figures.usual ?? 0, 1);
  const poiMax = Math.max(figures.poi ?? 0, figures.secondaryPoi ?? 0, 1);
  const layers: { id: Layer; label: string }[] = [
    { id: "people", label: copy.layerPeople },
    { id: "economy", label: copy.layerEconomy },
    { id: "syntax", label: copy.layerSyntax },
    { id: "carbon", label: copy.layerCarbon },
  ];

  return (
    <div className="planet-layout">
      <div>
        <div className="planet-stage" data-layer={layer}>
          <div className="planet-glow" aria-hidden />
          <svg viewBox="0 0 400 400" role="img" aria-label={copy.schematic}>
            <defs>
              <radialGradient id="advisory-globe" cx="38%" cy="34%" r="70%">
                <stop offset="0%" stopColor="#1f4f49" />
                <stop offset="55%" stopColor="#10211f" />
                <stop offset="100%" stopColor="#070908" />
              </radialGradient>
              <clipPath id="advisory-clip">
                <circle cx="200" cy="200" r="112" />
              </clipPath>
            </defs>
            <ellipse className="planet-orbit" cx="200" cy="200" rx="156" ry="58" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="4 7" transform="rotate(-18 200 200)" />
            <ellipse className="planet-orbit is-b" cx="200" cy="200" rx="176" ry="72" fill="none" stroke="currentColor" strokeOpacity="0.28" transform="rotate(24 200 200)" />
            <ellipse className="planet-orbit is-c planet-carbon" cx="200" cy="200" rx="194" ry="86" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 8" transform="rotate(-42 200 200)" />
            <circle cx="200" cy="200" r="112" fill="url(#advisory-globe)" />
            <g clipPath="url(#advisory-clip)" className="planet-streets" fill="none" stroke="#e7c27a" strokeWidth="1.4">
              <path d="M120 150 C 160 170, 190 140, 250 160" />
              <path d="M110 190 C 170 180, 210 210, 290 185" />
              <path d="M130 230 C 180 215, 230 250, 300 225" />
              <path d="M150 120 C 145 180, 170 230, 140 280" />
              <path d="M210 115 C 225 175, 200 240, 230 290" />
              <path d="M255 125 C 250 190, 275 240, 260 285" />
            </g>
            <ellipse cx="168" cy="168" rx="46" ry="28" fill="#f3efe6" opacity="0.08" />
            <circle className="planet-orbit" cx="312" cy="132" r="4" fill="currentColor" />
          </svg>
        </div>
        <p className="mt-3 text-center text-[12px] text-muted">{copy.schematic}</p>
      </div>
      <div>
        <div className="planet-layers" role="group" aria-label={copy.planetTitle}>
          {layers.map((item) => (
            <button key={item.id} type="button" aria-pressed={layer === item.id} onClick={() => setLayer(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="planning-prose mt-4">{layerReading(layer, copy)}</p>
        {layer === "people" ? (
          <div className="planet-meters">
            <Meter label={copy.visitors} value={figures.visitors} max={peopleMax} />
            <Meter label={copy.residents} value={figures.residents} max={peopleMax} />
            <Meter label={copy.workers} value={figures.workers} max={peopleMax} />
          </div>
        ) : null}
        {layer === "economy" ? (
          <div className="planet-meters">
            <Meter label={figures.industry ?? copy.industry} value={figures.poi} max={poiMax} />
            <Meter label={figures.secondary ?? ""} value={figures.secondaryPoi} max={poiMax} />
          </div>
        ) : null}
        {layer === "syntax" ? (
          <ul className="planet-meters text-sm text-secondary">
            <li>400 m · 800 m · 1200 m · n</li>
            <li>NAIN · NACH</li>
            <li>{copy.notRun}</li>
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
