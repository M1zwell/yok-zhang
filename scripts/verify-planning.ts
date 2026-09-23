import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Indicator, RawRecord } from "../lib/planning/logic.ts";
import {
  coverage,
  dependencyEdges,
  heroFigures,
  historyFor,
  latestByCode,
  normalizeTask,
  taskChecks,
} from "../lib/planning/logic.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const indicators = JSON.parse(readFileSync(join(root, "lib/planning/indicators.json"), "utf8")) as Indicator[];
const records = JSON.parse(readFileSync(join(root, "lib/planning/task9.json"), "utf8")) as RawRecord[];
const attempts = normalizeTask(records);
const latest = latestByCode(attempts);
const figures = heroFigures(attempts, latest);
const checks = taskChecks(latest);
const counts = coverage(indicators, latest);
const edges = dependencyEdges(latest, indicators);

assert.equal(indicators.length, 39);
assert.equal(records.length, 40);
assert.equal(latest.size, 39);
assert.equal(counts.value, 28);
assert.equal(counts.zero, 2);
assert.equal(counts.error, 6);
assert.equal(counts.no_data, 3);
assert.equal(counts.value + counts.zero + counts.error + counts.no_data, 39);

assert.equal(figures.city, "郑州");
assert.equal(figures.district, "洛阳");
assert.equal(figures.usual, 82800);
assert.equal(figures.workers, 32600);
assert.equal(figures.residents, 50200);
assert.equal(figures.visitors, 385251);
assert.equal(figures.labor, 95.84);
assert.equal(figures.industry, "餐饮服务");
assert.equal(figures.poi, 1362);
assert.equal(figures.hotels, 435);
assert.equal(figures.scope, "郑州洛阳");

const population = checks.find((check) => check.id === "population");
const age = checks.find((check) => check.id === "age");
assert.equal(population?.ok, true);
assert.equal(age?.ok, true);
assert.match(checks.find((check) => check.id === "area")?.detail ?? "", /3\.14 km²/);
assert.match(checks.find((check) => check.id === "visitors")?.detail ?? "", /4\.7×/);

assert.equal(latest.get("IF03")?.status, "zero");
assert.equal(historyFor(attempts, "IF03").length, 2);
assert.equal(historyFor(attempts, "IF03")[0]?.status, "error");
assert.equal(latest.get("IF06")?.status, "no_data");
assert.equal(latest.get("IF09")?.status, "error");
assert.equal(latest.get("SE12")?.status, "zero");

const edge = (code: string) => edges.find((item) => item.code === code);
assert.equal(edge("IF02")?.state, "checked");
assert.equal(edge("IF10")?.state, "blocked");
assert.equal(edge("IF11")?.state, "blocked");
assert.equal(edge("SE05")?.state, "checked");
assert.equal(edge("SE09")?.state, "checked");

const task8 = JSON.parse(readFileSync(join(root, "lib/planning/task8.json"), "utf8")) as RawRecord[];
const erqiAttempts = normalizeTask(task8);
const erqiLatest = latestByCode(erqiAttempts);
const erqi = heroFigures(erqiAttempts, erqiLatest);
const erqiChecks = taskChecks(erqiLatest);
assert.equal(erqi.city, "郑州");
assert.equal(erqi.district, "二七区");
assert.equal(erqi.usual, 1930400);
assert.equal(erqi.workers, 634600);
assert.equal(erqi.residents, 1295800);
assert.equal(erqi.visitors, 3576859);
assert.equal(erqiChecks.find((check) => check.id === "population")?.ok, true);
assert.equal(erqiChecks.find((check) => check.id === "age")?.ok, true);
assert.match(erqiChecks.find((check) => check.id === "area")?.detail ?? "", /78\.50 km²/);
assert.match(erqiChecks.find((check) => check.id === "visitors")?.detail ?? "", /1\.9×/);
assert.equal(erqi.if03Contested, true);
assert.equal(erqi.retailCount, 10881);
assert.equal(erqi.mixIndex, 43);
assert.equal(erqi.mixType, "商业零售");
assert.equal(erqi.industry, "制造业");
assert.equal(erqi.nightShare, 26.67);
assert.equal(erqi.openHours, 11.63);
assert.equal(erqi.reviewScore, 4.62);
assert.equal(erqiLatest.get("IF03")?.status, "zero");
assert.equal(erqiLatest.get("IF06")?.status, "no_data");

const page = readFileSync(join(root, "app/planning/page.tsx"), "utf8");
const localePage = readFileSync(join(root, "app/[locale]/planning/page.tsx"), "utf8");
assert.match(page, /PlanningDesk/);
assert.match(localePage, /PlanningDesk/);
assert.match(readFileSync(join(root, "app/components/SiteHeader.tsx"), "utf8"), /\/planning/);

console.log("planning checks ok");
