import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isPlanningOwner, PLANNING_OWNER_EMAIL } from "../lib/planning/gate.ts";
import type { Indicator, RawRecord } from "../lib/planning/logic.ts";
import {
  coverage,
  dependencyEdges,
  exportRows,
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

assert.equal(PLANNING_OWNER_EMAIL, "yying2010@gmail.com");
assert.equal(isPlanningOwner("yying2010@gmail.com"), true);
assert.equal(isPlanningOwner(" YYING2010@Gmail.com "), true);
assert.equal(isPlanningOwner("yok@dseek.ai"), false);
assert.equal(isPlanningOwner(""), false);
assert.equal(isPlanningOwner(null), false);

const page = readFileSync(join(root, "app/planning/page.tsx"), "utf8");
const localePage = readFileSync(join(root, "app/[locale]/planning/page.tsx"), "utf8");
const gate = readFileSync(join(root, "app/components/planning/PlanningGate.tsx"), "utf8");
const header = readFileSync(join(root, "app/components/SiteHeader.tsx"), "utf8");
const site = readFileSync(join(root, "lib/site.ts"), "utf8");
assert.match(page, /PlanningGate/);
assert.match(localePage, /PlanningGate/);
assert.match(page, /index: false/);
assert.match(localePage, /index: false/);
assert.doesNotMatch(page, /PlanningDesk/);
assert.doesNotMatch(localePage, /PlanningDesk/);
assert.match(gate, /PlanningDesk/);
assert.match(gate, /ssr: false/);
assert.match(gate, /verifyPlanningOwner/);
assert.match(header, /PlanningNavLink/);
assert.doesNotMatch(header, /href: "\/planning"/);
assert.doesNotMatch(site, /ichina\.co\/planning/);
assert.match(site, /ggherePlanet: "https:\/\/gghere.com\/hk\?district=central-belt"/);
assert.match(site, /ggherePlanetHome: "https:\/\/gghere.com\/planet"/);

const desk = readFileSync(join(root, "app/components/planning/PlanningDesk.tsx"), "utf8");
const planet = readFileSync(join(root, "app/components/planning/AdvisoryPlanet.tsx"), "utf8");
const copy = readFileSync(join(root, "lib/planning/copy.ts"), "utf8");
const gateCopy = readFileSync(join(root, "lib/planning/gate.ts"), "utf8");
const footer = readFileSync(join(root, "app/components/SiteFooter.tsx"), "utf8");
const home = readFileSync(join(root, "app/components/HomeView.tsx"), "utf8");
const palette = readFileSync(join(root, "app/components/CommandPalette.tsx"), "utf8");

assert.match(desk, /id="zhengzhou"/);
assert.match(desk, /id="luoyang"/);
assert.match(desk, /data-planet=\{planetId\}/);
assert.match(desk, /planetId="zhengzhou"/);
assert.match(desk, /planetId="luoyang"/);
assert.match(desk, /boundary=\{copy\.boundaryErqi\}/);
assert.match(desk, /boundary=\{copy\.boundary\}/);
assert.match(desk, /exportRows\(visible, exportBundle\.latest, includeProposed\)/);
assert.doesNotMatch(desk, /onRun/);
assert.doesNotMatch(planet, /onRun/);
assert.match(planet, /data-reading="people"/);
assert.match(planet, /data-reading="economy"/);
assert.match(planet, /data-slot="streets"/);
assert.match(planet, /streetSlot/);

assert.match(copy, /not a district of Zhengzhou/);
assert.match(copy, /不是郑州的区/);
assert.match(copy, /不是鄭州的區/);
assert.doesNotMatch(copy, /洛阳区/);
assert.doesNotMatch(copy, /洛陽區/);
assert.doesNotMatch(copy, /Luoyang District/);
assert.match(copy, /case "ja"/);
assert.match(copy, /case "ko"/);
assert.match(copy, /case "th"/);
assert.match(copy, /case "nl"/);

assert.doesNotMatch(page, /二七区|1930400|1,930,400/);
assert.doesNotMatch(localePage, /二七区|1930400|1,930,400/);
assert.doesNotMatch(gate, /二七区|1930400|1,930,400/);
assert.doesNotMatch(gateCopy, /二七区|1930400|1,930,400/);
assert.match(gateCopy, /yying2010@gmail.com/);
const gateEmails = gateCopy.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
assert.ok(gateEmails.length > 0);
assert.ok(gateEmails.every((email) => email.toLowerCase() === "yying2010@gmail.com"));

const plain = exportRows(indicators, latest, false);
assert.equal(plain.some((row) => row.code.startsWith("SX")), false);
const withProposed = exportRows(indicators, erqiLatest, true);
for (const code of ["SX01", "SX02", "SX03", "SX04", "SX05"]) {
  assert.equal(withProposed.some((row) => row.catalog === "proposed" && row.code === code), true);
}
assert.equal(withProposed.filter((row) => row.catalog === "authorized" && row.code.startsWith("SX")).length, 0);

assert.match(footer, /PlanningNavLink/);
assert.doesNotMatch(footer, /href: "\/planning"/);
assert.match(home, /PlanningNavLink/);
assert.match(palette, /isPlanningOwner/);
assert.match(palette, /item\.id !== "planning"/);
assert.doesNotMatch(palette, /二七区|1930400|1,930,400/);

console.log("planning checks ok");
