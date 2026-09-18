# HK building clickable service — AI coding brief

Date: 2026-09-07  
Status: research verified against live APIs; **not implemented**  
Languages: 中文 / English  
Target product: `jubuddy.com/planet` · `gghere.com/hk?district=central-belt`  
Seed building: MY CENTRAL, 23 Graham Street, Central  
Seed listing: https://hk.centanet.com/findproperty/detail/MY-CENTRAL_LJC654

This file is for an AI coding agent. Follow the constraints. Do not scrape broker floorplan PNGs. Do not treat Centanet media as open data.

本文件给编程 AI 用。遵守约束。不要抓取中原平面图 PNG。不要把代理图则当开放数据。

---

## 0. Mission / 任务

Port an **advanced clickable building** drill-down onto the existing city-planet:

现有城市行星已能点建筑。要把「点进去」接到产品上：

1. Click a Hong Kong building on `/planet` (or gghere Central Belt).
2. If LandsD 3D Indoor covers it → walk **vector floors / units**.
3. If it is private residential (MY CENTRAL) → show a **schematic unit stack** from public facts, then **deep-link** to statutory / broker plans.
4. Never host Centanet `floorPlans` / `unitPlans` rasters.

Existing product facts (this garden):

- Flagship: 393 planets, 4.5M building footprints, open map data, no account.
- Live HD planet: https://gghere.com/hk?district=central-belt
- Planet surface: https://jubuddy.com/planet
- Catalog: https://gghere.com/worlds

---

## 1. Hard constraints / 硬约束

### Do

- Use free public HK APIs listed in §4–§5.
- Attribute Lands Department on any map face: `Map from Lands Department`.
- Rate-limit LandsD / CSDI calls. Indoor WFS: **one venue per request**, max **5000** features.
- Request your own 3D tiles API key from `3dmap@landsd.gov.hk`. Do not bake a demo key into production.
- Deep-link Centanet / SRPE for real 平面图.
- Treat ALS / Location Search misses as first-class (MY CENTRAL brand name often fails).

### Do not

- Scrape or hotlink Centanet `hkfloorplan.centanet.com` / `hkcdn.centanet.com/imgresize/floorplan` into the product.
- Trace broker PNGs into GeoJSON.
- Assume LandsD 3D Indoor covers private flats. **MY CENTRAL is not in the indoor venue list.**
- Use paid iB1000 / iG1000 full extracts as if they were open.
- Call `geodata.gov.hk` Location Search (hostname retired 2026-05-04). Use `www.map.gov.hk`.

---

## 2. Seed listing — MY CENTRAL LJC654

Verified from the live Centanet detail page on 2026-09-07.

| Field | Value |
|---|---|
| URL | https://hk.centanet.com/findproperty/detail/MY-CENTRAL_LJC654 |
| Estate page | https://hk.centanet.com/estate/en/My-Central/1-SEPPWGPEPE |
| Estate | MY CENTRAL |
| Address | 23 Graham Street / 嘉咸街23号 |
| District | Central, Central & Western |
| Unit | High floor Flat D / 高层 D室 |
| Sale | HKD 35,000,000 |
| Rent | HKD 54,000 / month |
| Saleable | 811 ft² · HKD 43,156 / ft² |
| Layout | 3 rooms, 1 ensuite |
| Aspect | Northwest |
| Age | 7 years (OP 2018-12) |
| Developer | URA / CK Hutchison |
| Management | Citybase Property Management |
| Stock | 1 tower, 185 units |
| Listing id | `LJC654` |
| Estate code | `SEPPWGPEPE` |
| 3D tour | Matterport on listing (`SEPPWGPEPEPSSD_…`) |
| Updated | 2026-09-07 |

Podium retail that official geocoders actually know: **MyCentral H18 Conet**, 23 Graham Street.

官方地理编码器认得的是平台商场名 **MyCentral H18 Conet**，不是住宅品牌 MY CENTRAL。

Approximate HK1980 from Location Search: `x=833876.48`, `y=816055.79` (WGS84 ~ 22.2834, 114.1537). Confirm before pinning.

---

## 3. Layouts that exist (public facts, not drawings)

From developer unit-mix reporting (HKET) plus broker floor-band pages. Use this as **schematic click targets**. Do not copy plan geometry.

发展商户型分布 + 代理楼层带。用作示意点击，不要描图。

### 3.1 Building rules

- 1 tower, **6 units per floor: A B C D E F**
- 185 residential units
- Omitted floors: **4, 13, 14, 24, 34**
- Residential floors: 5–12, 15–23, 25–33, 35–39
- All standard units: ensuite; open kitchen on C/F

### 3.2 Unit mix

| Flats | Type | Saleable ft² | Count |
|---|---|---|---|
| C, F | 2-bed + 1 ensuite, open kitchen | 674–679 | 61 |
| D, E | 3-bed + 1 ensuite + study | 783–839 | 61 |
| A, B | 3-bed + 1 ensuite + study | 906–1132 | 63 |
| special | platforms / roofs | up to ~1132 | 6 |

Seed listing **D @ 811 ft²** = standard mid/high **D/E 3-bed**.

Recent Land Registry samples (for overlay, not geometry):

- 22/F D · 811 ft²
- 5/F D · 765 ft² (special / lower)
- E often 820 ft²
- 39/F E · 1115 ft² (special)

### 3.3 Floor-plate bands (broker grouping)

Use as schematic “typical floor” groups, not as indoor polygons:

1. 5/F
2. 6–10/F
3. 11–12, 15–18/F
4. 19–20/F
5. 21/F
6. 22–23, 25/F
7. 26–33, 35–38/F
8. 39/F
9. roof

Special notes from public write-ups: 5/F D·E and 39/F E have platforms; 39/F A·B·D have roofs.

### 3.4 Statutory plans

Official first-hand floor plans: **SRPE** https://www.srpe.gov.hk/  
View / deep-link only. Sales brochure drawings remain developer copyright.

一手法定平面图只外链 SRPE。楼书图则仍属版权。

---

## 4. Centanet floorplan layer (proprietary — do not ingest)

中原平面图层是专有栅格。只作对照，禁止入库。

The Nuxt payload on the listing embeds four media types:

| Layer | Role | IDs seen on this listing |
|---|---|---|
| `floorPlans` (`newFP`) | typical floor-plate PNG | `79048 79049 79051 79053 79054` |
| `unitPlans` (`newUP`) | unit 户型 PNG | `81242 81250 81262 81264 81265 81267 81277 81283` |
| planning diagram | 规划图 | label `My Central 規劃圖` |
| legacy | old `img.aspx` | `13cpal00123037VLSXZZID.png` |

This listing’s unit plan: **`81264_2000_Centaline.png`**, `unitplangroup=22293`.

Hosts (do not fetch into product):

- `hkfloorplan.centanet.com` / `floorplan.centanet.com` `img.aspx?dir=…`
- `hkcdn.centanet.com/imgresize/floorplan/newFP|newUP/202201/…`
- `hkfp2.centanet.com`

Product context: Feb 2026 Centanet **「户型搵楼」** ~1,400 estates / ~770,000 units. Click a layout → same 开则 listings + transactions. Closed product, not a public API.

If a future commercial licence exists, treat it as a **separate overlay**, never as the planet base layer.

---

## 5. Public APIs and datasets / 开放接口

Three layers. A+B are implementable now. C is schematic + link.

分三层。A+B 现在就能做。C 只能示意 + 外链。

### 5.1 Layer A — clickable building (city / planet)

| Source | What | Endpoint / access | Licence |
|---|---|---|---|
| CSDI 3D Spatial Data | Cesium 3D Tiles, HK buildings | `https://data.map.gov.hk/api/3d-data/3dsd/WGS84/building/tileset.json?key=KEY` | Free commercial + non-commercial **with attribution**. Key: `3dmap@landsd.gov.hk`. Doc: https://portal.csdi.gov.hk/csdi-webpage/apidoc/3d-spatial-data-api |
| 3D Visualisation Map | photoreal mesh | `https://data.map.gov.hk/api/3d-data/3dtiles/f2/tileset.json?key=KEY` | same. Doc: https://tools.csdi.gov.hk/csdi-webpage/apidoc/3d-visualisation-map-api |
| Open3Dhk | viewer + Streetscape 360 | https://3d.map.gov.hk | same |
| Overture Maps buildings | footprints + HK address source | GeoParquet S3/Azure; `overturemaps download --bbox=xmin,ymin,xmax,ymax -f geojson --type=building` | ODbL / mixed. https://docs.overturemaps.org/getting-data/ |
| OpenStreetMap | footprints, names, levels | Overpass / Geofabrik | ODbL |
| Microsoft open buildings | ML footprints | https://github.com/microsoft/GlobalMLBuildingFootprints | CDLA Permissive 2.0 |
| Location Search | name/address → HK1980 xy | `https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=` | free, rate-limited. Doc: https://portal.csdi.gov.hk/csdi-webpage/apidoc/LocationSearchAPI |
| ALS / GeoAddress | formatted address + lat/lon + GeoAddress id | `https://www.als.gov.hk/lookup?q=&n=5` | open. 3D (flat/floor) **only for public housing**. Dataset: https://data.gov.hk/en-data/dataset/hk-dpo-als_01-als |
| 3D Pedestrian Network | walk graph GeoJSON | CSDI / data.gov.hk | free |
| Building CSUID | official building id | https://portal.csdi.gov.hk/csdi-webpage/apidoc/LPPUNSearchAPI | free |
| CSDI terms | reuse | https://portal.csdi.gov.hk/csdi-webpage/doc/TNC | must name Government + CSDI as source |

Live check 2026-09-07: 3D building tileset JSON returns with `asset.statistics.components ≈ 218794`.

**Geocode trap for this seed:**

```text
# Often fails / wrong building
q=MY CENTRAL
q=23 GRAHAM STREET   → ALS suggests Garley Building, Tin On Sing (old neighbours)

# Works
q=23 Graham Street          → Location Search: MyCentral H18 Conet podium
q=H18 Conet
q=嘉咸街23號                 → Location Search: same H18 hit; ALS still fuzzy
```

Join keys for planet: **coordinates + CSUID**, not brand name alone.

Join 用坐标 / CSUID，不要只靠楼名。

iB1000 / iG1000 appear on data.gov.hk but full 1:1000 building polygons remain a **paid** LandsD digital-map product. Prefer CSDI 3D tiles + Overture/OSM.

### 5.2 Layer B — indoor vector floors (government)

Live WFS on 2026-09-07: **no API key required**. Still: LandsD logo, copyright notice, rate limit, TLS 1.2+.

实测 WFS 不用 key。仍要 logo、版权、限流。

Base:

```text
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/{feature}?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&cql_filter=venue_id%3D%27{venue_id}%27
```

Venue list (no filter):

```text
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/venue_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json
```

Docs: https://portal.csdi.gov.hk/csdi-webpage/apidoc/3d-indoor-map-api  
MTR: https://portal.csdi.gov.hk/csdi-webpage/apidoc/3d-indoor-mtr-station-map

#### Building indoor `{feature}`

`venue_polygon` · `level_polygon` · `unit_polygon` · `unit_outline` · `opening_line` · `windows_line` · `amenity_point` · `occupant_point`

#### MTR indoor `{feature}`

`mtr_venue_polygon` · `mtr_level_polygon` · `mtr_unit_polygon` · `mtr_opening_line` · `mtr_amenity_point` · `mtr_occupant_point`

#### Live coverage 2026-09-07

| Set | Count | Notes |
|---|---|---|
| Building venues | **689** | Docs still mention 1,250 target; press ~600. This is the live list. |
| MTR venues | **98** | Includes Central, Sheung Wan, Hong Kong, Admiralty |
| MY CENTRAL | **absent** | Do not expect a venue_id |

Building venue categories: 416 `businesscampus`, 84 `resort` (often older walk-ups), 63 `shoppingcenter`, 61 `governmentfacility`, 53 `stadium`, 9 `hotel`, plus museum / healthcare / convention.

Central & Western: **32** venues. Useful near the seed:

| Name | category | venue_id | address |
|---|---|---|---|
| The Center / 中环中心 | businesscampus | `b0c9f4a3-65a6-4a48-a63c-77ac0049fafc` | 99 Queen's Road Central |
| Sheung Wan Municipal Services Building / 上环市政大厦 | governmentfacility | `69f155a8-14e0-454a-b7a5-b3e70eaa1be8` | 345 Queen's Road Central |
| World-wide House / 环球大厦 | businesscampus | `911fe169-eb7e-4156-a12d-99e462b5cf1b` | 19 Des Voeux Road Central |
| Nan Fung Tower / 南丰大厦 | businesscampus | `5c925080-8c16-4bb0-8f41-a1576426a251` | 88 Connaught Road Central |
| Shun Tak Centre | businesscampus | `ca34d8c6-2672-471d-a984-89e2c2506dda` | 202 Connaught Road Central |
| Admiralty Centre | businesscampus | `706671f9-849b-4143-8ed1-97ef20157557` | 18 Harcourt Road |

MTR near seed:

| Station | venue_id |
|---|---|
| Central Station | `036868f9-cb36-44ae-b1ee-7c18bb12dbed` |
| Sheung Wan Station | `404efe33-0d74-4c3e-972e-5f46339c10e8` |
| Hong Kong Station | `3c17605d-df03-4b09-90f5-bbca8cf1294d` |
| Admiralty Station | `b9b2f6ff-582d-40b0-b82d-027e950e6791` |

#### Indoor GeoJSON property keys (verified)

`level_polygon` sample (The Center, 75 levels):

- `level_id`, `level_floorpolyid`, `level_ordinal`, `level_z_value`
- `level_name_en`, `level_name_zh`, `level_short_name_en`
- `venue_id`, `building_id`, `address_address`

The Center ordinals include B3 (`-9.95m`) through roof; skip 4/13/14 style numbering appears in names (`6th/F` after entrance hall).

`unit_polygon` sample (Sheung Wan MSB, **1259** units):

- `unit_id`, `unit_category`, `unit_name_en`, `unit_name_zh`, `unit_unitnumbername`
- `level_id`, `level_ordinal`, `level_z_value`, `level_short_name_en`
- `venue_id`, `building_id`
- geometry: `Polygon`

`unit_category` examples: `unspecified`, `room`, `nonpublic`, `elevator`, `lobby`, `stairs`, `foodservice`, `walkway`, `ramp`, `escalator`, `steps`.

#### Related indoor datasets

- 3D Indoor Network (GeoJSON/SHP): https://data.gov.hk/en-data/dataset/hk-landsd-openmap-3d-indoor-network
- 3D Pedestrian Route Search (indoor ↔ outdoor): https://portal.csdi.gov.hk/csdi-webpage/apidoc/3d-pedestrian-route-search  
  `https://mapapi.hkmapservice.gov.hk/PedRoute/NAServer/route/solve?…`
- Travel modes: `https://mapapi.hkmapservice.gov.hk/PedRoute/NAServer/route/retrieveTravelModes?f=json`

This is the **only** free vector floorplan layer in Hong Kong. Public / commercial / GIC / MTR — **not private flats**.

这是香港唯一免费矢量室内平面。覆盖公营 / 商厦 / 港铁，不是私人住宅户型。

### 5.3 Layer C — residential 户型

No open vector API.

| Option | Use in product |
|---|---|
| SRPE PDFs | deep-link statutory brochure |
| Centanet listing / estate | deep-link `LJC654` / `SEPPWGPEPE`; do not host PNGs |
| OSM Simple Indoor Tagging | legal, sparse in HK; optional future contrib |
| **Schematic stack** | implement this: floors × A–F from §3 |

---

## 6. Target architecture / 接到 `/planet` 的做法

```
planet building click
  ├─ always: CSDI 3D tile / Overture footprint
  │          + Location Search / ALS / CSUID
  ├─ if LandsD venue_id (or mtr venue_id)
  │     → level_polygon → unit_polygon (clickable rooms)
  │     → optional PedRoute indoor-outdoor
  └─ else if private residential (seed: MY CENTRAL)
        ├─ schematic: floors × A–F from public unit mix
        ├─ highlight listing unit (D, 811 ft²)
        ├─ deep-link Centanet listing + estate 户型
        └─ deep-link SRPE brochure
```

Suggested types (TypeScript, exhaustive switches):

```ts
type BuildingClickMode =
  | { kind: "indoor"; venueId: string; source: "landsd-building" | "landsd-mtr" }
  | { kind: "schematic-residential"; estateId: string }
  | { kind: "footprint-only" };

type LandsdIndoorFeature =
  | "venue_polygon"
  | "level_polygon"
  | "unit_polygon"
  | "unit_outline"
  | "opening_line"
  | "windows_line"
  | "amenity_point"
  | "occupant_point";
```

Use a `never` default on switches over these unions.

### 6.1 Suggested files (this garden vs live planet)

This repo (`ichina.co` garden) currently **links out** to planet. Do not fake a full Cesium planet here unless the task is explicitly to prototype.

本园地目前是外链行星。除非明确要求原型，不要在本仓库伪造整颗 Cesium 行星。

If implementing on **jubuddy/gghere** (separate apps):

1. Cache `venue_polygon` (689) + `mtr_venue_polygon` (98) as a spatial index (bbox join to planet footprints).
2. On click: point-in-polygon → `venue_id` or miss.
3. Miss + known estate catalog → schematic residential.
4. Fetch indoor features **venue-by-venue** at click time (or pre-warm Central Belt only).
5. Render indoor with MapLibre / Cesium using WGS84 GeoJSON from WFS.
6. Attribution overlay always visible.

If implementing a **thin prototype on this garden**:

- Add a research/spec page already done (this file).
- Optional: a `/tools` or docs-linked JSON fixture of MY CENTRAL schematic + nearby `venue_id`s.
- Do not add a Centanet scraper.

### 6.2 Seed schematic model

```json
{
  "estateId": "SEPPWGPEPE",
  "nameEn": "MY CENTRAL",
  "nameZh": "MY CENTRAL",
  "addressEn": "23 Graham Street",
  "addressZh": "嘉咸街23號",
  "developer": "URA / CK Hutchison",
  "units": 185,
  "unitsPerFloor": ["A", "B", "C", "D", "E", "F"],
  "omittedFloors": [4, 13, 14, 24, 34],
  "floors": [5, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39],
  "layouts": {
    "A": { "beds": 3, "saleable": [906, 1132] },
    "B": { "beds": 3, "saleable": [906, 1132] },
    "C": { "beds": 2, "saleable": [674, 679] },
    "D": { "beds": 3, "saleable": [783, 839] },
    "E": { "beds": 3, "saleable": [783, 839] },
    "F": { "beds": 2, "saleable": [674, 679] }
  },
  "seedListing": {
    "ref": "LJC654",
    "url": "https://hk.centanet.com/findproperty/detail/MY-CENTRAL_LJC654",
    "floor": "high",
    "flat": "D",
    "saleable": 811,
    "beds": 3
  },
  "geocode": {
    "locationSearchName": "MyCentral H18 Conet",
    "hk1980": { "x": 833876.48, "y": 816055.79 },
    "alsHit": false,
    "landsdIndoorVenueId": null
  },
  "nearbyIndoor": [
    { "name": "Sheung Wan Station", "venueId": "404efe33-0d74-4c3e-972e-5f46339c10e8", "kind": "mtr" },
    { "name": "Central Station", "venueId": "036868f9-cb36-44ae-b1ee-7c18bb12dbed", "kind": "mtr" },
    { "name": "Sheung Wan Municipal Services Building", "venueId": "69f155a8-14e0-454a-b7a5-b3e70eaa1be8", "kind": "building" },
    { "name": "The Center", "venueId": "b0c9f4a3-65a6-4a48-a63c-77ac0049fafc", "kind": "building" }
  ],
  "outbound": {
    "centanetEstate": "https://hk.centanet.com/estate/en/My-Central/1-SEPPWGPEPE",
    "srpe": "https://www.srpe.gov.hk/",
    "open3dhk": "https://3d.map.gov.hk"
  }
}
```

---

## 7. Copy-paste API cheatsheet

```text
# geocode — prefer H18 / Graham Street, not only "MY CENTRAL"
https://www.map.gov.hk/gs/api/v1.0.0/locationSearch?q=23%20Graham%20Street

# address (often misses this URA tower)
https://www.als.gov.hk/lookup?q=23%20GRAHAM%20STREET&n=5

# indoor venues (689)
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/venue_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json

# floors of The Center
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/level_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&cql_filter=venue_id%3D%27b0c9f4a3-65a6-4a48-a63c-77ac0049fafc%27

# units of Sheung Wan MSB (1259)
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/unit_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json&cql_filter=venue_id%3D%2769f155a8-14e0-454a-b7a5-b3e70eaa1be8%27

# MTR venues (98)
https://mapapi.hkmapservice.gov.hk/ogc/wfs/indoor/mtr_venue_polygon?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json

# 3D buildings (request your own key)
https://data.map.gov.hk/api/3d-data/3dsd/WGS84/building/tileset.json?key=YOUR_KEY
```

Contacts:

- 3D tiles key: `3dmap@landsd.gov.hk`
- Map API: `mapapi@landsd.gov.hk`
- Location Search: `geoinfomap@landsd.gov.hk`

Map-face notice:

```text
Map from Lands Department
```

---

## 8. Implementation tasks (ordered)

1. **Index indoor venues** — download `venue_polygon` + `mtr_venue_polygon`, store bbox + `venue_id` + names. Refresh periodically.
2. **Join to planet footprints** — spatial join Overture/CSDI click target → indoor venue or miss.
3. **Indoor drill-down** — on hit, fetch `level_polygon` then `unit_polygon` for that `venue_id` only. Render clickable polygons. Cap 5000.
4. **Geocode fallback** — Location Search then ALS; if brand miss, use street number + manual estate catalog.
5. **Schematic residential** — seed MY CENTRAL from §6.2. Click floor → click flat letter → listing deep-link.
6. **Attribution + keys** — LandsD logo, T&C, production API key. No demo key in repo.
7. **Do not** build a Centanet scraper, floorplan CDN proxy, or raster-to-vector tracer.

Verification:

- The Center: 75 levels, indoor polygons render, click a room.
- Sheung Wan MSB: ~1259 units load (may need paging if client chokes).
- Sheung Wan MTR: `mtr_` features load.
- MY CENTRAL click: schematic A–F, D highlighted 811 ft², outbound links work, **no** indoor `venue_id`.
- ALS `MY CENTRAL` still allowed to fail; UI must not blank the building.

---

## 9. Source log / 核验记录

| Claim | How verified | When |
|---|---|---|
| Listing fields | Fetched Centanet HTML + JSON-LD | 2026-09-07 |
| Floorplan PNG ids | Parsed Nuxt `window.__NUXT__` | 2026-09-07 |
| Indoor 689 venues | WFS `venue_polygon` HTTP 200, 5.7MB | 2026-09-07 |
| The Center 75 levels | WFS `level_polygon` | 2026-09-07 |
| Sheung Wan MSB 1259 units | WFS `unit_polygon` 2.3MB | 2026-09-07 |
| MTR 98 stations | WFS `mtr_venue_polygon` | 2026-09-07 |
| MY CENTRAL not indoor | Name/address scan of 689 venues | 2026-09-07 |
| Location Search H18 | `www.map.gov.hk` JSON | 2026-09-07 |
| ALS miss | `als.gov.hk/lookup` | 2026-09-07 |
| 3D tiles live | `data.map.gov.hk` tileset.json | 2026-09-07 |
| Unit mix A–F | HKET developer release + broker pages | secondary |

---

## 10. One-line brief for the next agent

Clickable `/planet` buildings in HK: **CSDI/Overture footprint + LandsD indoor WFS (689 buildings, 98 MTR)**. Private estates like MY CENTRAL: **schematic A–F stack + deep-link Centanet/SRPE**. Centanet floorplan layer is **closed raster**. Do not scrape it.

`/planet` 可点击建筑：CSDI/Overture 足迹 + 地政室内 WFS（689 栋 / 98 站）。MY CENTRAL 这类私宅：A–F 示意叠楼 + 外链中原/SRPE。中原平面图层是封闭栅格，禁止抓取。
