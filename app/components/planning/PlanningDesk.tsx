"use client";

import { useRef, useState } from "react";
import indicatorData from "@/lib/planning/indicators.json";
import task8Data from "@/lib/planning/task8.json";
import task9Data from "@/lib/planning/task9.json";
import { planningCopy, type PlanningCopy } from "@/lib/planning/copy";
import {
  coverage,
  dependencyEdges,
  exportRows,
  formatCount,
  gloss,
  heroFigures,
  historyFor,
  latestByCode,
  matchesQuery,
  normalizeTask,
  parseDepends,
  proposedSpatial,
  series,
  shortValue,
  taskChecks,
  toCsv,
  uniqueSorted,
  type AttemptStatus,
  type Indicator,
  type RawRecord,
} from "@/lib/planning/logic";
import { planningSources } from "@/lib/planning/sources";
import type { Locale } from "@/lib/i18n";
import { links } from "@/lib/site";
import { AdvisoryPlanet, type RunId } from "./AdvisoryPlanet";
import "./planning.css";

const indicators = indicatorData as Indicator[];

function prepare(records: RawRecord[]) {
  const attempts = normalizeTask(records);
  const latest = latestByCode(attempts);
  return {
    attempts,
    latest,
    figures: heroFigures(attempts, latest),
    checks: taskChecks(latest),
    counts: coverage(indicators, latest),
    edges: dependencyEdges(latest, indicators),
  };
}

const bundles: Record<RunId, ReturnType<typeof prepare>> = {
  "task-8": prepare(task8Data as RawRecord[]),
  "task-9": prepare(task9Data as RawRecord[]),
};

const charts: { id: string; code: string; root: string; sort: boolean; title: keyof PlanningCopy }[] = [
  { id: "age", code: "SE04", root: "年龄段分布", sort: false, title: "distAge" },
  { id: "income", code: "SE06", root: "收入区间分布", sort: false, title: "distIncome" },
  { id: "job", code: "SE08", root: "职业分布", sort: true, title: "distJob" },
  { id: "spend", code: "SE24", root: "月消费区间分布", sort: false, title: "distSpend" },
  { id: "ticket", code: "SE26", root: "区域餐饮消费客单价分布", sort: false, title: "distTicket" },
  { id: "phone", code: "SE28", root: "手机价格分布", sort: false, title: "distPhone" },
  { id: "carrier", code: "SE27", root: "手机运营商分布", sort: true, title: "distCarrier" },
  { id: "sex", code: "SE18", root: "性别占比", sort: false, title: "distSex" },
];

const emptyQuery = { code: "", name: "", dimension: "", module: "", source: "" };

function statusLabel(status: AttemptStatus, copy: PlanningCopy): string {
  switch (status) {
    case "value":
      return copy.statusValue;
    case "zero":
      return copy.statusZero;
    case "no_data":
      return copy.statusNoData;
    case "error":
      return copy.statusError;
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

function pillClass(status: AttemptStatus): string {
  switch (status) {
    case "value":
      return "pill is-value";
    case "zero":
      return "pill is-zero";
    case "no_data":
      return "pill is-nodata";
    case "error":
      return "pill is-error";
    default: {
      const neverStatus: never = status;
      return neverStatus;
    }
  }
}

function download(filename: string, body: string, type: string) {
  const blob = new Blob([body], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function PlanningDesk({ locale }: { locale: Locale }) {
  const copy = planningCopy(locale);
  const [runId, setRunId] = useState<RunId>("task-8");
  const { attempts, latest, figures, checks, counts, edges } = bundles[runId];
  const [query, setQuery] = useState(emptyQuery);
  const [includeProposed, setIncludeProposed] = useState(false);
  const [selected, setSelected] = useState("SE01");
  const detailRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const dimensions = uniqueSorted(indicators.map((item) => item.dimension));
  const modules = uniqueSorted(indicators.map((item) => item.module));
  const sources = uniqueSorted(indicators.map((item) => item.sourceType));
  const visible = indicators.filter((item) => matchesQuery(item, query));
  const selectedIndicator = indicators.find((item) => item.code === selected) ?? null;
  const selectedAttempt = latest.get(selected);
  const selectedHistory = historyFor(attempts, selected);

  function choose(code: string) {
    setSelected(code);
    detailRef.current?.scrollIntoView({ block: "nearest" });
  }

  function exportFile(kind: "csv" | "json") {
    const rows = exportRows(visible, latest, includeProposed);
    if (kind === "csv") {
      download(`planning-${runId}.csv`, toCsv(rows), "text/csv;charset=utf-8");
      return;
    }
    const body = {
      task: runId,
      city: figures.city,
      district: figures.district,
      collectedAt: figures.collectedAt,
      includeProposed,
      rows,
    };
    download("planning-task9.json", JSON.stringify(body, null, 2), "application/json");
  }

  return (
    <div className="planning-page page-x mx-auto max-w-6xl">
      <div className="planning-hero">
        <p className="kicker">{copy.kicker}</p>
        <h1 className="planning-title mt-3">{copy.title}</h1>
        <p className="planning-alt">{copy.titleAlt}</p>
        <p className="planning-lede mt-6">{copy.lede}</p>
        <p className="planning-boundary">{runId === "task-8" ? copy.boundaryErqi : copy.boundary}</p>
        <p className="planning-prose mt-4">{copy.portBody}</p>
        <nav className="planning-jump" aria-label={copy.jump}>
          <a href="#reading">{copy.navReading}</a>
          <a href="#planet">{copy.navPlanet}</a>
          <a href="#indicators">{copy.navIndicators}</a>
          <a href="#syntax">{copy.navSyntax}</a>
          <a href="#research">{copy.navResearch}</a>
        </nav>
      </div>

      <section id="planet" className="planning-section is-first">
        <p className="kicker">{copy.planetKicker}</p>
        <h2 className="mt-3">{copy.planetTitle}</h2>
        <p className="planning-prose mt-4">{copy.planetLede}</p>
        <p className="planning-k mt-6">{copy.compareTitle}</p>
        <AdvisoryPlanet copy={copy} figures={figures} runId={runId} onRun={setRunId} />
        <div className="planning-links">
          <a className="btn btn-primary" href={links.ggherePlanetHome} target="_blank" rel="noopener noreferrer">
            {copy.openGghere} <span aria-hidden>↗</span>
          </a>
          <a className="btn btn-ghost" href={links.jubuddyPlanet} target="_blank" rel="noopener noreferrer">
            {copy.openPlanet} <span aria-hidden>↗</span>
          </a>
          <a className="btn btn-ghost" href={links.gghereWorlds} target="_blank" rel="noopener noreferrer">
            {copy.openWorlds} <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      <section id="reading" className="planning-section">
        <p className="kicker">{copy.followKicker}</p>
        <h2 className="mt-3">{copy.followTitle}</h2>
        <p className="planning-prose mt-4">{copy.followLede}</p>
        <div className="planning-stats">
          <Stat label={copy.usual} value={figures.usual === null ? "—" : formatCount(figures.usual)} unit="SE01 · 人" />
          <Stat label={copy.residents} value={figures.residents === null ? "—" : formatCount(figures.residents)} unit="SE03" />
          <Stat label={copy.workers} value={figures.workers === null ? "—" : formatCount(figures.workers)} unit="SE02" />
          <Stat label={copy.visitors} value={figures.visitors === null ? "—" : formatCount(figures.visitors)} unit="SE10" />
          <Stat label={copy.labor} value={figures.labor === null ? "—" : `${formatCount(figures.labor)}%`} unit="SE05" />
          <Stat label={copy.density} value={figures.density === null ? "—" : formatCount(figures.density)} unit="SE09 · 人/km²" />
          <Stat label={copy.industry} value={figures.industry ?? "—"} unit={figures.poi === null ? "IF01" : `IF01 · ${formatCount(figures.poi)} POI`} />
          <Stat
            label={copy.walk}
            value={figures.hotels === null ? "—" : formatCount(figures.hotels)}
            unit={figures.stops === null ? "SE14" : `SE14 · ${formatCount(figures.stops)} stops`}
          />
        </div>
        <div className="planning-stats">
          <Stat label={copy.housing} value={figures.housing === null ? "—" : formatCount(figures.housing)} unit="SE11 · 元/㎡" />
          <Stat label={copy.rent} value={figures.rent === null ? "—" : String(figures.rent)} unit="SE15 · 元/㎡/天" />
          <Stat label={copy.floors} value={figures.floors === null ? "—" : String(figures.floors)} unit="SE16 · 层" />
          <Stat label={copy.dining} value={figures.dining === null ? "—" : formatCount(figures.dining)} unit="SE25 · 元/月" />
        </div>
        <p className="planning-prose mt-4">{copy.peopleNote}</p>
        <div className="planning-notes">
          {runId === "task-9" ? <p className="planning-note is-alert">{copy.contradiction}</p> : null}
          {figures.if03Contested ? <p className="planning-note is-alert">{copy.contestedIf03}</p> : null}
          {figures.mixType && figures.industry && figures.mixType !== figures.industry ? (
            <p className="planning-note is-alert">{copy.industryClash}</p>
          ) : null}
          {figures.nightShare === null ? (
            <p className="planning-note">{copy.night}</p>
          ) : (
            <p className="planning-note">{copy.nightKnown}</p>
          )}
          <p className="planning-note">{copy.carbon}</p>
          <p className="planning-note">{copy.images}</p>
          {figures.mixIndex === null ? <p className="planning-note">{copy.mix}</p> : null}
          <p className="planning-note">{copy.events}</p>
        </div>
        <div className="planning-split">
          <div>
            <h3 className="mt-2 font-display text-xl tracking-tight">{copy.checksTitle}</h3>
            <div className="planning-checks mt-3">
              {checks.map((check) => (
                <div key={check.id} className="planning-check">
                  <b className={check.ok ? "is-ok" : "is-bad"}>{check.ok ? copy.pass : copy.fail}</b>
                  <div>
                    {checkLabel(check.id, copy)}
                    <small>{check.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mt-2 font-display text-xl tracking-tight">{copy.coverage}</h3>
            <div
              className="coverage-bar mt-4"
              role="img"
              aria-label={`${copy.statusValue} ${counts.value}, ${copy.statusZero} ${counts.zero}, ${copy.statusError} ${counts.error}, ${copy.statusNoData} ${counts.no_data}`}
            >
              <span className="is-value" style={{ width: `${(counts.value / counts.total) * 100}%` }} />
              <span className="is-zero" style={{ width: `${(counts.zero / counts.total) * 100}%` }} />
              <span className="is-error" style={{ width: `${(counts.error / counts.total) * 100}%` }} />
              <span className="is-nodata" style={{ width: `${(counts.no_data / counts.total) * 100}%` }} />
            </div>
            <div className="coverage-legend">
              <span>{copy.statusValue} {counts.value}</span>
              <span>{copy.statusZero} {counts.zero}</span>
              <span>{copy.statusError} {counts.error}</span>
              <span>{copy.statusNoData} {counts.no_data}</span>
            </div>
            <div className="edge-list">
              {edges.map((edge) => (
                <span key={edge.code} className={`pill is-${edge.state}`} title={edge.detail}>
                  {edge.code} ← {edge.needs.join(", ")}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="planning-charts">
          {charts.map((chart) => {
            const rows = series(latest.get(chart.code), chart.root);
            const ordered = chart.sort ? [...rows].sort((a, b) => b.value - a.value) : rows;
            if (ordered.length === 0) return null;
            const max = Math.max(...ordered.map((row) => row.value), 1);
            return (
              <article key={chart.id} className="planning-chart">
                <h3>
                  {copy[chart.title]} <span className="font-mono text-[11px] text-muted">{chart.code}</span>
                </h3>
                <div className="bar-list">
                  {ordered.map((row) => (
                    <div key={row.label} className="bar-row">
                      <span>{row.label}</span>
                      <div className="bar-track" aria-hidden>
                        <span style={{ width: `${(row.value / max) * 100}%` }} />
                      </div>
                      <b>{formatCount(row.value)}%</b>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="indicators" className="planning-section">
        <p className="kicker">{copy.indicatorKicker}</p>
        <h2 className="mt-3">{copy.indicatorTitle}</h2>
        <p className="planning-prose mt-4">{copy.indicatorLede}</p>
        <form
          className="planning-form"
          onSubmit={(event) => {
            event.preventDefault();
            tableRef.current?.scrollIntoView({ block: "nearest" });
          }}
        >
          <div className="planning-fields">
            <label>
              {copy.code}
              <input
                value={query.code}
                onChange={(event) => setQuery({ ...query, code: event.target.value })}
                placeholder="IF01"
                autoComplete="off"
              />
            </label>
            <label>
              {copy.name}
              <input
                value={query.name}
                onChange={(event) => setQuery({ ...query, name: event.target.value })}
                autoComplete="off"
              />
            </label>
            <label>
              {copy.dimension}
              <select value={query.dimension} onChange={(event) => setQuery({ ...query, dimension: event.target.value })}>
                <option value="">{copy.any}</option>
                {dimensions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              {copy.module}
              <select value={query.module} onChange={(event) => setQuery({ ...query, module: event.target.value })}>
                <option value="">{copy.any}</option>
                {modules.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              {copy.source}
              <select value={query.source} onChange={(event) => setQuery({ ...query, source: event.target.value })}>
                <option value="">{copy.any}</option>
                {sources.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="planning-actions">
            <button className="btn btn-primary" type="submit">
              {copy.query}
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setQuery(emptyQuery);
                setIncludeProposed(false);
              }}
            >
              {copy.reset}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => exportFile("csv")}>
              {copy.exportExcel}
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => exportFile("json")}>
              {copy.exportJson}
            </button>
            <label className="planning-checkline">
              <input
                type="checkbox"
                checked={includeProposed}
                onChange={(event) => setIncludeProposed(event.target.checked)}
              />
              {copy.proposedToggle}
            </label>
          </div>
          <p className="font-mono text-[11px] text-muted">
            {visible.length} {copy.results}
            {figures.collectedAt ? ` · ${figures.collectedAt}` : ""}
          </p>
        </form>

        {selectedIndicator ? (
          <div ref={detailRef} className="planning-detail">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3>
                {selectedIndicator.code} {selectedIndicator.name}
              </h3>
              <button className="btn btn-ghost" type="button" onClick={() => setSelected("")}>
                {copy.close}
              </button>
            </div>
            <p className="mt-1 text-sm text-secondary">{gloss[selectedIndicator.code]}</p>
            <p className="mt-3 text-sm leading-relaxed">
              {selectedIndicator.definition || copy.definitionMissing}
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted">
              {selectedIndicator.unit} · {selectedIndicator.sourceType} · {selectedIndicator.timeGranularity} ·{" "}
              {selectedIndicator.required ? copy.requiredYes : copy.requiredNo}
              {parseDepends(selectedIndicator.dependsOn).length > 0
                ? ` · ${copy.depends} ${parseDepends(selectedIndicator.dependsOn).join(", ")}`
                : ""}
            </p>
            {selectedAttempt ? (
              <p className="mt-3">
                <span className={pillClass(selectedAttempt.status)}>{statusLabel(selectedAttempt.status, copy)}</span>
                <span className="ml-2 font-mono text-[11px] text-muted">{selectedAttempt.collectTime}</span>
              </p>
            ) : null}
            {selectedAttempt?.error ? <p className="mt-2 text-sm text-spark">{selectedAttempt.error}</p> : null}
            {selectedAttempt && selectedAttempt.leaves.length > 0 ? (
              <div className="leaf-list">
                {selectedAttempt.leaves.map((leaf) => (
                  <div key={leaf.path}>
                    <span className="text-muted">{leaf.path}</span> {leaf.text}
                  </div>
                ))}
              </div>
            ) : null}
            {selectedHistory.length > 1 ? (
              <div className="attempt-list">
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{copy.attempts}</p>
                {selectedHistory.map((attempt) => (
                  <p key={attempt.id} className="text-sm">
                    <span className={pillClass(attempt.status)}>{statusLabel(attempt.status, copy)}</span>{" "}
                    <span className="font-mono text-[11px] text-muted">{attempt.collectTime}</span>{" "}
                    {attempt.error ?? shortValue(attempt)}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div ref={tableRef} className="planning-table-wrap">
          {visible.length === 0 ? (
            <p className="p-4 text-sm text-muted">{copy.empty}</p>
          ) : (
            <table className="planning-table">
              <thead>
                <tr>
                  <th>{copy.colCode}</th>
                  <th>{copy.colName}</th>
                  <th>{copy.colUnit}</th>
                  <th>{copy.colType}</th>
                  <th>{copy.colGrain}</th>
                  <th>{copy.colModule}</th>
                  <th>{copy.colRequired}</th>
                  <th>{copy.colDepends}</th>
                  <th>{copy.colTask}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => {
                  const attempt = latest.get(item.code);
                  return (
                    <tr
                      key={item.code}
                      data-selected={selected === item.code}
                      onClick={() => choose(item.code)}
                    >
                      <th scope="row">
                        <button className="linkish" type="button" onClick={() => choose(item.code)}>
                          {item.code}
                        </button>
                      </th>
                      <td>
                        {item.name}
                        <span className="mt-0.5 block text-[11px] text-muted">{gloss[item.code]}</span>
                      </td>
                      <td>{item.unit}</td>
                      <td className="font-mono text-[11px]">{item.sourceType}</td>
                      <td>{item.timeGranularity}</td>
                      <td>{item.module}</td>
                      <td>{item.required ? copy.requiredYes : copy.requiredNo}</td>
                      <td className="font-mono text-[11px]">{item.dependsOn || "—"}</td>
                      <td>
                        {attempt ? (
                          <span className={pillClass(attempt.status)}>{statusLabel(attempt.status, copy)}</span>
                        ) : (
                          "—"
                        )}
                        <span className="mt-1 block max-w-56 text-[11px] text-muted">{shortValue(attempt)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section id="syntax" className="planning-section">
        <p className="kicker">{copy.syntaxKicker}</p>
        <h2 className="mt-3">{copy.syntaxTitle}</h2>
        <p className="planning-prose mt-4">{copy.syntaxLede}</p>
        <ol className="step-list mt-6">
          <li>
            <span>
              <b>QGIS</b> — {copy.stepBoundary}
            </span>
          </li>
          <li>
            <span>
              <b>depthmapX</b> — {copy.stepGraph}
            </span>
          </li>
          <li>
            <span>
              <b>gghere.com/planet</b> — {copy.stepJoin}
            </span>
          </li>
        </ol>
        <p className="planning-prose mt-4">{copy.radii}</p>
        <p className="planning-note mt-4">{copy.formula}</p>
        <p className="planning-prose mt-4">{copy.se14}</p>
        <p className="planning-prose mt-4">{copy.also}</p>
        <h3 className="mt-8 font-display text-2xl tracking-tight">{copy.proposedTitle}</h3>
        <div className="measure-list">
          {proposedSpatial.map((measure) => (
            <article key={measure.code} className="measure-card">
              <p className="font-mono text-[11px] text-accent">
                {measure.code} · {measure.tool} · {copy.notRun}
              </p>
              <h4 className="mt-1 text-base font-semibold">
                {measure.name} <span className="font-normal text-secondary">{measure.gloss}</span>
              </h4>
              <p className="mt-2">{measure.definition}</p>
              <p className="mt-2 font-mono text-[11px] text-muted">
                {measure.unit} · {measure.links}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="research" className="planning-section">
        <p className="kicker">{copy.researchKicker}</p>
        <h2 className="mt-3">{copy.researchTitle}</h2>
        <p className="planning-prose mt-4">{copy.researchLede}</p>
        <div className="source-list">
          {planningSources.map((source) => (
            <article key={source.id} className="source-card">
              <p className="font-mono text-[11px] text-muted">{source.year}</p>
              <h3 className="mt-1 text-base">
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  {source.title} <span aria-hidden>↗</span>
                </a>
              </h3>
              <p className="mt-1 text-[13px]">{source.detail}</p>
              <p className="mt-2">{locale === "zh-Hans" || locale === "zh-Hant" ? source.zh : source.en}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-10 font-display text-2xl tracking-tight">{copy.contractTitle}</h3>
        <p className="planning-prose mt-3">{copy.contractBody}</p>
      </section>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <article className="planning-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{unit}</em>
    </article>
  );
}

function checkLabel(id: "population" | "age" | "area" | "visitors", copy: PlanningCopy): string {
  switch (id) {
    case "population":
      return copy.checkPopulation;
    case "age":
      return copy.checkAge;
    case "area":
      return copy.checkArea;
    case "visitors":
      return copy.checkVisitors;
    default: {
      const neverId: never = id;
      return neverId;
    }
  }
}
