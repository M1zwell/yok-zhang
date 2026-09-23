export type AttemptStatus = "value" | "zero" | "no_data" | "error";

export type Indicator = {
  code: string;
  name: string;
  unit: string;
  sourceType: string;
  timeGranularity: string;
  dimension: string;
  module: string;
  definition: string;
  required: boolean;
  dependsOn: string;
  category: string;
};

export type RawRecord = {
  id: number;
  indicatorCode: string;
  indicatorName: string;
  city: string;
  district: string;
  collectTime: string;
  dataStatus?: string;
  error?: string;
  values?: unknown;
} & Record<string, unknown>;

export type Leaf = {
  path: string;
  text: string;
  numeric: number | null;
};

export type Attempt = {
  id: number;
  code: string;
  name: string;
  city: string;
  district: string;
  collectTime: string;
  status: AttemptStatus;
  error?: string;
  note?: string;
  leaves: Leaf[];
};

export type ProposedMeasure = {
  code: string;
  name: string;
  gloss: string;
  unit: string;
  tool: string;
  definition: string;
  links: string;
};

export type SeriesRow = { label: string; value: number };

export type CheckResult = {
  id: "population" | "age" | "area" | "visitors";
  ok: boolean;
  detail: string;
};

export type DependencyEdge = {
  code: string;
  needs: string[];
  state: "checked" | "blocked" | "open";
  detail: string;
};

const RESERVED = new Set([
  "id",
  "indicatorCode",
  "indicatorName",
  "city",
  "district",
  "collectTime",
  "values",
  "dataStatus",
  "error",
]);

const WORKING_AGE = [
  "18-24岁",
  "25-29岁",
  "30-34岁",
  "35-39岁",
  "40-44岁",
  "45-49岁",
  "50-54岁",
  "55-59岁",
  "60-64岁",
];

export const gloss: Record<string, string> = {
  IF01: "Leading industry type",
  IF02: "Primary industry class",
  IF03: "Daily-life service provision",
  IF04: "Functional mix",
  IF05: "Micro-renewal retrofit share",
  IF06: "Low-carbon strategies",
  IF07: "Low-impact development measures",
  IF08: "Green certification",
  IF09: "Core store hours",
  IF10: "Night venues, count and share",
  IF11: "24-hour facilities, count and share",
  SE01: "Usual population",
  SE02: "Workplace population",
  SE03: "Resident population",
  SE04: "Age structure",
  SE05: "Working-age share",
  SE06: "Income bands",
  SE07: "Education share",
  SE08: "Occupation mix",
  SE09: "Usual population density",
  SE10: "Visitors",
  SE11: "Average housing price",
  SE12: "Event frequency",
  SE13: "Comparative price",
  SE14: "10-minute walk circle",
  SE15: "Average office rent",
  SE16: "Average office floors",
  SE17: "Review-site score",
  SE18: "Sex share",
  SE19: "Marital status",
  SE20: "Presence of children",
  SE21: "Child age share",
  SE22: "Home ownership",
  SE23: "Drives a car",
  SE24: "Monthly spend bands",
  SE25: "Monthly dining spend",
  SE26: "Dining ticket size",
  SE27: "Mobile carrier",
  SE28: "Handset price",
};

export const proposedSpatial: ProposedMeasure[] = [
  {
    code: "SX01",
    name: "角度整合度",
    gloss: "Normalised angular integration (NAIN)",
    unit: "NAIN",
    tool: "depthmapX",
    links: "SE09, IF04",
    definition:
      "To-movement potential of each street segment. depthmapX angular segment analysis, then NAIN = node count^1.2 / (total depth + 2). Radii 400, 800, 1200, n.",
  },
  {
    code: "SX02",
    name: "角度选择度",
    gloss: "Normalised angular choice (NACH)",
    unit: "NACH",
    tool: "depthmapX",
    links: "IF01, SE10",
    definition:
      "Through-movement potential. NACH = log(choice + 1) / log(total depth + 3). The route the street network offers before land use is assigned.",
  },
  {
    code: "SX03",
    name: "可理解度",
    gloss: "Intelligibility",
    unit: "r",
    tool: "depthmapX",
    links: "SX01",
    definition:
      "Correlation of local connectivity and global integration. High intelligibility means what you see from a street predicts the larger district.",
  },
  {
    code: "SX04",
    name: "网络服务区",
    gloss: "Network service area",
    unit: "m",
    tool: "QGIS + Space Syntax Toolkit",
    links: "SE14, IF03",
    definition:
      "Walk reach along the street network, not a circle around the centroid. A 10-minute walk is about 800 m only if speed is taken as 80 m/min. That speed is a convention until it is measured here.",
  },
  {
    code: "SX05",
    name: "吸引到达",
    gloss: "Attraction reach",
    unit: "index",
    tool: "QGIS Space Syntax Toolkit",
    links: "IF01, IF03, IF04",
    definition:
      "POI and frontage joined to segments, then weighted by syntactic closeness. This is the missing bridge from a facility count to functional mix.",
  },
];

export function parseDepends(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function numericFromText(text: string): number | null {
  const trimmed = text.trim().replace(/,/g, "");
  if (!trimmed || trimmed === "无数据") return null;
  if (!/^-?\d+(?:\.\d+)?%?$/.test(trimmed)) return null;
  const value = Number(trimmed.replace("%", ""));
  return Number.isFinite(value) ? value : null;
}

export function flattenLeaves(value: unknown, path = ""): Leaf[] {
  if (value === null || value === undefined) return [];
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return [];
    return [{ path, text: String(value), numeric: value }];
  }
  if (typeof value === "string") {
    return [{ path, text: value, numeric: numericFromText(value) }];
  }
  if (typeof value === "boolean") {
    return [{ path, text: value ? "true" : "false", numeric: null }];
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return value.flatMap((item, index) => flattenLeaves(item, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) => {
      const next = path ? `${path} · ${key}` : key;
      return flattenLeaves(child, next);
    });
  }
  return [];
}

function extras(record: RawRecord): unknown {
  const bag: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!RESERVED.has(key)) bag[key] = value;
  }
  return bag;
}

export function classifyAttempt(record: RawRecord): Attempt {
  const error = typeof record.error === "string" ? record.error : undefined;
  const values = record.values ?? extras(record);
  const leaves = flattenLeaves(values);
  const noData =
    record.dataStatus === "NO_DATA" ||
    leaves.some((leaf) => leaf.path === "状态" || leaf.path.endsWith(" · 状态"));
  let status: AttemptStatus;
  if (error) status = "error";
  else if (noData) status = "no_data";
  else {
    const numbers = leaves.filter((leaf) => leaf.numeric !== null);
    if (numbers.length > 0 && numbers.every((leaf) => leaf.numeric === 0)) status = "zero";
    else if (leaves.length > 0) status = "value";
    else status = "error";
  }
  const note = leaves.find((leaf) => leaf.path === "说明" || leaf.path.endsWith(" · 说明"))?.text;
  return {
    id: record.id,
    code: record.indicatorCode,
    name: record.indicatorName,
    city: record.city,
    district: record.district,
    collectTime: record.collectTime,
    status,
    error,
    note,
    leaves,
  };
}

export function normalizeTask(records: RawRecord[]): Attempt[] {
  return records.map(classifyAttempt).sort((a, b) => a.id - b.id);
}

export function latestByCode(attempts: Attempt[]): Map<string, Attempt> {
  const grouped = new Map<string, Attempt[]>();
  for (const attempt of attempts) {
    const list = grouped.get(attempt.code) ?? [];
    list.push(attempt);
    grouped.set(attempt.code, list);
  }
  const latest = new Map<string, Attempt>();
  for (const [code, list] of grouped) {
    const sorted = [...list].sort((a, b) => {
      if (a.collectTime === b.collectTime) return a.id - b.id;
      return a.collectTime < b.collectTime ? -1 : 1;
    });
    const winner = sorted[sorted.length - 1];
    if (winner) latest.set(code, winner);
  }
  return latest;
}

export function historyFor(attempts: Attempt[], code: string): Attempt[] {
  return attempts
    .filter((attempt) => attempt.code === code)
    .sort((a, b) => (a.collectTime < b.collectTime ? -1 : 1));
}

export function leafNumber(attempt: Attempt | undefined, path: string): number | null {
  if (!attempt) return null;
  const leaf = attempt.leaves.find((item) => item.path === path);
  return leaf?.numeric ?? null;
}

export function leafText(attempt: Attempt | undefined, path: string): string | null {
  if (!attempt) return null;
  return attempt.leaves.find((item) => item.path === path)?.text ?? null;
}

export function series(attempt: Attempt | undefined, root: string): SeriesRow[] {
  if (!attempt) return [];
  const prefix = `${root} · `;
  return attempt.leaves
    .filter((leaf) => leaf.path.startsWith(prefix) && leaf.numeric !== null)
    .map((leaf) => ({
      label: leaf.path.slice(prefix.length),
      value: leaf.numeric ?? 0,
    }));
}

export function numericLeaves(attempt: Attempt | undefined): Leaf[] {
  if (!attempt) return [];
  return attempt.leaves.filter((leaf) => leaf.numeric !== null && !leaf.path.includes(" · "));
}

function round(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function taskChecks(latest: Map<string, Attempt>): CheckResult[] {
  const usual = leafNumber(latest.get("SE01"), "常驻人口规模");
  const workers = leafNumber(latest.get("SE02"), "工作人口规模");
  const residents = leafNumber(latest.get("SE03"), "居住人口规模");
  const density = leafNumber(latest.get("SE09"), "常驻人口密度");
  const visitors = leafNumber(latest.get("SE10"), "到访人口");
  const labor = leafNumber(latest.get("SE05"), "劳动年龄人口占比");
  const ages = series(latest.get("SE04"), "年龄段分布");
  const ageSum = WORKING_AGE.reduce((sum, label) => {
    const row = ages.find((item) => item.label === label);
    return sum + (row?.value ?? 0);
  }, 0);
  const populationOk =
    usual !== null && workers !== null && residents !== null && workers + residents === usual;
  const ageOk = labor !== null && Math.abs(ageSum - labor) < 0.02;
  const area = usual !== null && density !== null && density !== 0 ? usual / density : null;
  const ratio = usual !== null && visitors !== null && usual !== 0 ? visitors / usual : null;
  return [
    {
      id: "population",
      ok: populationOk,
      detail:
        usual === null || workers === null || residents === null
          ? "SE01 / SE02 / SE03 missing"
          : `${workers} + ${residents} = ${workers + residents}; SE01 = ${usual}`,
    },
    {
      id: "age",
      ok: ageOk,
      detail:
        labor === null ? "SE05 missing" : `18–64 sums to ${round(ageSum)}%; SE05 = ${round(labor)}%`,
    },
    {
      id: "area",
      ok: area !== null,
      detail: area === null ? "SE01 or SE09 missing" : `SE01 / SE09 = ${round(area)} km²`,
    },
    {
      id: "visitors",
      ok: ratio !== null,
      detail: ratio === null ? "SE10 or SE01 missing" : `SE10 / SE01 = ${round(ratio, 1)}×`,
    },
  ];
}

function usable(attempt: Attempt | undefined): boolean {
  return attempt?.status === "value" || attempt?.status === "zero";
}

export function dependencyEdges(latest: Map<string, Attempt>, indicators: Indicator[]): DependencyEdge[] {
  const checks = taskChecks(latest);
  const ageHolds = checks.find((check) => check.id === "age")?.ok === true;
  const populationHolds = checks.find((check) => check.id === "population")?.ok === true;
  return indicators
    .filter((indicator) => parseDepends(indicator.dependsOn).length > 0)
    .map((indicator) => {
      const needs = parseDepends(indicator.dependsOn);
      const self = latest.get(indicator.code);
      const parents = needs.map((code) => latest.get(code));
      const blocked = [self, ...parents].some(
        (attempt) => !attempt || attempt.status === "error" || attempt.status === "no_data",
      );
      let state: DependencyEdge["state"] = "open";
      if (blocked) state = "blocked";
      else if (indicator.code === "SE05") state = ageHolds && populationHolds ? "checked" : "open";
      else if (usable(self) && parents.every(usable)) state = "checked";
      const parentText = needs.map((code) => `${code} ${latest.get(code)?.status ?? "missing"}`).join(", ");
      return {
        code: indicator.code,
        needs,
        state,
        detail: `${indicator.code} ${self?.status ?? "missing"} ← ${parentText}`,
      };
    });
}

export type Coverage = Record<AttemptStatus, number> & { total: number };

export function coverage(indicators: Indicator[], latest: Map<string, Attempt>): Coverage {
  const counts: Coverage = { value: 0, zero: 0, no_data: 0, error: 0, total: indicators.length };
  for (const indicator of indicators) {
    const status = latest.get(indicator.code)?.status;
    if (status) counts[status] += 1;
  }
  return counts;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export type HeroFigures = {
  city: string;
  district: string;
  collectedAt: string;
  scope: string | null;
  usual: number | null;
  workers: number | null;
  residents: number | null;
  visitors: number | null;
  labor: number | null;
  density: number | null;
  housing: number | null;
  rent: number | null;
  floors: number | null;
  dining: number | null;
  drive: number | null;
  industry: string | null;
  poi: number | null;
  secondary: string | null;
  secondaryPoi: number | null;
  hotels: number | null;
  stops: number | null;
};

export function heroFigures(attempts: Attempt[], latest: Map<string, Attempt>): HeroFigures {
  const collectedAt = attempts.reduce((max, attempt) => (attempt.collectTime > max ? attempt.collectTime : max), "");
  const anchor = latest.get("SE01");
  return {
    city: anchor?.city ?? "",
    district: anchor?.district ?? "",
    collectedAt,
    scope: leafText(latest.get("SE12"), "统计范围"),
    usual: leafNumber(latest.get("SE01"), "常驻人口规模"),
    workers: leafNumber(latest.get("SE02"), "工作人口规模"),
    residents: leafNumber(latest.get("SE03"), "居住人口规模"),
    visitors: leafNumber(latest.get("SE10"), "到访人口"),
    labor: leafNumber(latest.get("SE05"), "劳动年龄人口占比"),
    density: leafNumber(latest.get("SE09"), "常驻人口密度"),
    housing: leafNumber(latest.get("SE11"), "房均价"),
    rent: leafNumber(latest.get("SE15"), "写字楼平均日租金"),
    floors: leafNumber(latest.get("SE16"), "写字楼平均层数"),
    dining: leafNumber(latest.get("SE25"), "月餐饮消费额度"),
    drive: leafNumber(latest.get("SE23"), "驾车占比"),
    industry: leafText(latest.get("IF01"), "主导产业类型"),
    poi: leafNumber(latest.get("IF01"), "POI数量"),
    secondary: leafText(latest.get("IF01"), "次要产业类型"),
    secondaryPoi: leafNumber(latest.get("IF01"), "次要产业POI数量"),
    hotels: leafNumber(latest.get("SE14"), "步行圈酒店数"),
    stops: leafNumber(latest.get("SE14"), "步行圈公交站数"),
  };
}

export function shortValue(attempt: Attempt | undefined): string {
  if (!attempt) return "";
  if (attempt.status === "error") return attempt.error ?? "error";
  if (attempt.status === "no_data") return attempt.note ?? "NO_DATA";
  const headline = attempt.leaves.find((leaf) => leaf.numeric === null && leaf.text && !leaf.path.includes(" · "));
  const numbers = attempt.leaves.filter((leaf) => leaf.numeric !== null).slice(0, 4);
  const parts: string[] = [];
  if (headline) parts.push(`${headline.path}: ${headline.text}`);
  for (const leaf of numbers) {
    if (leaf.path.includes(" · ")) continue;
    parts.push(`${leaf.path}: ${formatCount(leaf.numeric ?? 0)}`);
  }
  if (parts.length === 0 && numbers[0]) {
    parts.push(`${numbers[0].path}: ${formatCount(numbers[0].numeric ?? 0)}`);
  }
  if (attempt.status === "zero" && parts.length === 0) return "0";
  return parts.join(" · ");
}

export type ExportRow = {
  catalog: "authorized" | "proposed";
  code: string;
  name: string;
  gloss: string;
  unit: string;
  sourceType: string;
  timeGranularity: string;
  dimension: string;
  module: string;
  category: string;
  required: string;
  dependsOn: string;
  definition: string;
  taskStatus: string;
  taskSummary: string;
};

export function exportRows(
  indicators: Indicator[],
  latest: Map<string, Attempt>,
  includeProposed: boolean,
): ExportRow[] {
  const authorized: ExportRow[] = indicators.map((indicator) => {
    const attempt = latest.get(indicator.code);
    return {
      catalog: "authorized",
      code: indicator.code,
      name: indicator.name,
      gloss: gloss[indicator.code] ?? "",
      unit: indicator.unit,
      sourceType: indicator.sourceType,
      timeGranularity: indicator.timeGranularity,
      dimension: indicator.dimension,
      module: indicator.module,
      category: indicator.category,
      required: indicator.required ? "yes" : "no",
      dependsOn: indicator.dependsOn,
      definition: indicator.definition,
      taskStatus: attempt?.status ?? "missing",
      taskSummary: shortValue(attempt),
    };
  });
  if (!includeProposed) return authorized;
  const proposed: ExportRow[] = proposedSpatial.map((measure) => ({
    catalog: "proposed",
    code: measure.code,
    name: measure.name,
    gloss: measure.gloss,
    unit: measure.unit,
    sourceType: measure.tool,
    timeGranularity: "with the network model",
    dimension: "空间配置",
    module: "空间句法",
    category: "空间句法",
    required: "proposed",
    dependsOn: measure.links,
    definition: measure.definition,
    taskStatus: "not_run",
    taskSummary: "",
  }));
  return [...authorized, ...proposed];
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toCsv(rows: ExportRow[]): string {
  const header = [
    "catalog",
    "code",
    "name",
    "gloss",
    "unit",
    "sourceType",
    "timeGranularity",
    "dimension",
    "module",
    "category",
    "required",
    "dependsOn",
    "definition",
    "taskStatus",
    "taskSummary",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => csvCell(row[key as keyof ExportRow])).join(","));
  }
  return `\uFEFF${lines.join("\n")}`;
}

export function matchesQuery(
  indicator: Indicator,
  query: { code: string; name: string; dimension: string; module: string; source: string },
): boolean {
  const code = query.code.trim().toLowerCase();
  const name = query.name.trim().toLowerCase();
  if (code && !indicator.code.toLowerCase().includes(code)) return false;
  if (name) {
    const hay = `${indicator.name} ${gloss[indicator.code] ?? ""}`.toLowerCase();
    if (!hay.includes(name)) return false;
  }
  if (query.dimension && indicator.dimension !== query.dimension) return false;
  if (query.module && indicator.module !== query.module) return false;
  if (query.source && indicator.sourceType !== query.source) return false;
  return true;
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "zh"));
}
