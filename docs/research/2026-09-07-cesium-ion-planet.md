# Cesium ion → /planet — AI coding brief

Date: 2026-09-07  
Status: research against live Cesium docs; **not implemented**  
Companions:
- `docs/research/2026-09-07-hk-building-clickable-planet.md`
- `docs/research/2026-09-07-planet-3d-traffic-simulation.md`  
Target: `jubuddy.com/planet` · `gghere.com/hk?district=central-belt` · `gghere.com/worlds`  
Dashboard: https://ion.cesium.com  
API: https://api.cesium.com  
CDN: https://assets.cesium.com  
Languages: 中文 / English

This file is for an AI coding agent. **Cesium ion is the tiling factory + asset CDN + global content depot.** CesiumJS (or MapLibre + 3D Tiles) is the globe. Do not treat ion.cesium.com as a replacement for CSDI HK tiles, SUMO, or depthmapX.

本文件给编程 AI。**ion 是切片工厂 + CDN + 全球底图仓库。** 地球引擎仍是 CesiumJS。不要用 ion 替换地政 3D Tiles、SUMO 或 depthmapX。

---

## 0. What https://ion.cesium.com actually is / 这个网址是什么

The SPA at `ion.cesium.com` is the **account dashboard** (My Assets, Stories, tokens). Coding talks to:

这个 SPA 是账号后台。写代码打的是：

| Host | Role |
|---|---|
| `ion.cesium.com` | humans: upload UI, asset preview, Stories |
| `api.cesium.com` | REST: create/list/tile/query assets |
| `assets.cesium.com` | streamed `tileset.json` / terrain / imagery |

Three products, one login:

1. **Asset Depot** — ready-to-stream globe: Cesium World Terrain (asset id **1**), Cesium OSM Buildings (~350M), Bing/Google/Azure imagery, **Google Photorealistic 3D Tiles**.
2. **Tiler** — your files → 3D Tiles / quantized-mesh / WMTS. REST-automatable.
3. **Host + optional Self-Hosted** — Kubernetes on-prem if data cannot leave your cloud.

`/planet` already has a globe. ion fills **ingest of production meshes/BIM** and **non-HK city fallback**. It does not simulate traffic or indoor VGA.

`/planet` 已有地球。ion 补的是 **生产 mesh/BIM 入库** 和 **非港城市底图**。不管车流、不管空间句法。

---

## 1. Split: what ion owns vs what it does not

```
ion owns                          not ion
─────────────────────────────     ────────────────────────────────
tile IFC/RVT/OBJ/LAS/CityGML      CesiumJS / MapLibre camera
host 3D Tiles + BIM element DB    CSDI HK tileset.json (keep it)
OSM Buildings / World Terrain     SUMO TraCI poses
Google Photorealistic 3D Tiles    depthmapXcli VGA CSV
clip-and-ship archives            LandsD indoor WFS
OAuth tokens + quotas             Centanet floorplan PNGs
```

Layer map (extends the sim brief):

```
planet camera
  ├─ A0  ion World Terrain / imagery          [optional globe floor]
  ├─ A1  CSDI 3D Tiles (HK HD)                [source of truth in HK]
  ├─ A1b ion OSM Buildings OR Google Photoreal [24-city / worlds fallback]
  ├─ A2  ion fromIonAssetId(your IFC/photo)   [production mesh you got]
  ├─ click building
  │     ├─ B0  LandsD indoor WFS or schematic
  │     ├─ B0b GET /assets/{id}/elements      [if BIM/CAD + Database]
  │     ├─ B1  VGA heatmap (depthmapXcli)
  │     └─ B2  agent trails
  └─ C   SUMO / GTFS / TD speeds              [unchanged]
```

HK Central Belt default = **A1 CSDI**, not OSM Buildings and not Google Photoreal. Those two are coarser / quota-metered / not official HK geometry.

中环带默认 **地政 A1**。OSM Buildings / Google 实景只做 24 城目录或没 CSDI 的城市。

---

## 2. Coding surface / 能写进产品的 API

### 2.1 Tokens (hard split)

| Token | Scopes | Where |
|---|---|---|
| **write** | `assets:write` (+ `archives:write` if clip) | **server only** — Netlify function / worker. Never ship to the browser |
| **read** | `assets:read` (+ `geocode` if using ion geocoder) | CesiumJS `Ion.defaultAccessToken`. Restrict to listed asset ids in the ion Tokens UI |
| **list** | `assets:list` / `assets:limited-list` | admin tooling, not the public planet |

Create tokens at ion → Access Tokens. Header: `Authorization: Bearer <token>`.

OAuth 2.0 `authorizationCode` + **PKCE** exists if a user brings their own ion account. `/planet` should **not** require that for the default globe.

网页行星不要强迫用户登录 ion。用你们自己的 read token。

### 2.2 REST ingest (when you got production files)

Four steps. Docs: https://cesium.com/learn/ion/ion-upload-rest · https://cesium.com/learn/ion/rest-api/

```
POST /v1/assets          → assetId + S3 uploadLocation (creds ~12h)
PUT  S3 prefix           → source zip (AWS SDK v4, us-east-1)
POST .../uploadComplete  → tiling starts
GET  /v1/assets/{id}     → AWAITING_FILES | NOT_STARTED | IN_PROGRESS | COMPLETE | DATA_ERROR | ERROR
```

`sourceType` values that matter for `/planet`:

| You got | `type` | `options.sourceType` | Result |
|---|---|---|---|
| Licensed **IFC / RVT / DWG / DXF / DGN** | `3DTILES` | `BIM_CAD` | indoor mesh; prefer **3D Tiles + Database** in the dashboard so Asset Elements API works |
| Photogrammetry / LiDAR mesh (OBJ/FBX/glTF) | `3DTILES` | `3D_CAPTURE` | set `targetVersion: "1.1"`, `textureFormat: "KTX2"` |
| Point cloud LAS/LAZ | `3DTILES` | `POINT_CLOUD` | street / MMS |
| CityGML | `3DTILES` | `CITYGML` | `clampToTerrain: true`, `baseTerrainId: 1` |
| Already 3D Tiles | `3DTILES` | (rehost) | only if you must CDN it; **do not re-upload CSDI** |
| GeoJSON footprints | `GEOJSON` or vector `3DTILES` | `VECTOR_DATA` / native | Overture overlay, not buildings mesh |

HK BIM CRS: models are often **EPSG:2326** (HK 1980 Grid) + HKPD heights. BIM/CAD Tiler with Database **requires a known projected CRS** or the mesh will not sit on the globe. Search CRS via ion `GET` coordinate-system search (docs: “Search coordinate reference systems”). Wrong vertical datum = floating in the sky or buried.

香港 BIM 常用 **EPSG:2326**。竖向基准错了会飞天或入地。

### 2.3 Runtime in CesiumJS (browser)

```ts
import {
  Ion,
  Viewer,
  Terrain,
  createOsmBuildingsAsync,
  createGooglePhotorealistic3DTileset,
  Cesium3DTileset,
  IonGeocodeProviderType,
} from "cesium";

Ion.defaultAccessToken = readToken; // assets:read only

type PlanetGlobeBase =
  | { kind: "csdi-hk"; tilesetUrl: string; attribution: "landsd" }
  | { kind: "ion-osm"; useWorldTerrain: true }
  | { kind: "ion-google-photoreal" }
  | { kind: "ion-asset"; assetId: number; attribution: string };

function assertNever(x: never): never {
  throw new Error(String(x));
}

async function mountGlobeBase(viewer: Viewer, base: PlanetGlobeBase): Promise<void> {
  switch (base.kind) {
    case "csdi-hk": {
      const tileset = await Cesium3DTileset.fromUrl(base.tilesetUrl);
      viewer.scene.primitives.add(tileset);
      return;
    }
    case "ion-osm": {
      viewer.scene.primitives.add(await createOsmBuildingsAsync());
      return;
    }
    case "ion-google-photoreal": {
      viewer.scene.globe.show = false;
      viewer.scene.primitives.add(await createGooglePhotorealistic3DTileset());
      return;
    }
    case "ion-asset": {
      viewer.scene.primitives.add(await Cesium3DTileset.fromIonAssetId(base.assetId));
      return;
    }
    default:
      return assertNever(base);
  }
}
```

Google Photorealistic requires `globe: false` and `geocoder: IonGeocodeProviderType.GOOGLE`. Enable the Google tileset on the ion account first.

CSDI URL stays `https://data.map.gov.hk/api/3d-data/.../tileset.json?key=KEY` (previous brief). Do not proxy CSDI through ion.

地政 URL 直连。不要把政府瓦片再传一遍 ion。

### 2.4 BIM click → element query (production IFC)

Tiler choice: https://cesium.com/learn/bim-cad/tiling-bim-cad-models/bim-cad-tiler-selection-guide/

- **Design Tiler** — IFC/RVT geometry in the tileset (older path).
- **BIM/CAD Tiler with Database** (Technology Preview, 2026) — IFC/RVT/DWG/DXF/DGN; properties live in ion DB; **this is the one that makes indoor clickable without loading every tile**.

```
GET https://api.cesium.com/assets/{assetId}/elements
  ?where=className%20LIKE%20'%25Window%25'
  Authorization: Bearer <read-token>
```

Also: `filter` = URL-encoded Mongo operators (`$eq`, `$in`, `$like`, …). Do not send `filter` and `where` together.

Response shape: `{ id, location: { center: { longitude, latitude, height }, radius }, properties }`.

On `/planet`: after footprint click, if `ionBimAssetId` exists, fetch elements (doors/windows/storeys) **and** show LandsD WFS if `venueId` exists. MY CENTRAL has no LandsD indoor venue — BIM-on-ion is the only true indoor path if you obtain IFC.

MY CENTRAL 没有地政室内图。拿到 IFC 后，ion BIM+Database 才是真室内可点。

### 2.5 Archives / clip-and-ship

`archives:write` → zip of tiles for offline or to copy onto your own CDN. Counts against **storage** quota. Use when you must not depend on `assets.cesium.com` at runtime. Google Photorealistic and Bing **cannot** go fully offline.

Google 实景 / Bing 不能整包离线。

---

## 3. What each ion dataset is useful for on /planet

| ion content | Useful for | Not useful for |
|---|---|---|
| **World Terrain** (id 1) | globe floor, clamp CityGML, SUMO z if you lack HK DTM | replacing CSDI vis-map |
| **OSM Buildings** | `gghere.com/worlds` 24-city catalog; click via OSM `elementId`; hide one footprint when overlaying a custom tower | HK HD Central Belt (CSDI is better) |
| **Google Photorealistic 3D Tiles** | “the city looks real” for cities without a government mesh | production HK survey geometry; metered **root tiles** |
| **Bing/Google/Azure imagery** | globe when not using photoreal mesh; metered **sessions** | HK official basemap |
| **Your IFC/RVT via BIM+DB** | MY CENTRAL / any licensed tower: indoor pick, hide OSM mass, feed DXF to depthmapXcli from the same IFC | raster Centanet plans |
| **Your photogrammetry** | campus / streetscape sister to CSDI vis-map | city-wide HK (CSDI already has vis-map) |
| **Stories** | marketing share links | the product `/planet` tab |

---

## 4. Licence, money, quotas (production)

Public page: https://cesium.com/platform/cesium-ion/pricing/ (USD, checked 2026-09-07)

| Plan | Price | Storage | Streaming |
|---|---|---|---|
| Community | Free, **personal / non-commercial** | 10 GB | 15 GB / month |
| Commercial | $149 / mo individual · $524 / mo team | 100 GB | 150 GB / month |
| Premium | $499 / mo · $874 / mo team | 500 GB | 500 GB / month |
| Custom / Self-Hosted | sales | as needed | as needed |

Paid-account triggers (Cesium FAQ): org **>$50k** revenue or funding, **government** work, funded research, or over Community quotas. Exploratory eval can stay on Community.

**Integration pricing:** *Contact us if you plan to integrate Cesium ion into solutions used outside your organization.* `/planet` is a public product → assume you need **Commercial+ and an integration conversation**, not a silent Community token.

把 ion 嵌进对外产品要跟 Cesium 谈集成授权。不要用 Community token 撑公开 `/planet`。

Other meters that will bite a globe app:

- Global imagery: **sessions** (1k / 5k / 10k per month on listed plans)
- Google Photorealistic: **root tiles** (same 1k / 5k / 10k)
- BIM/CAD Database API: no extra quota during Technology Preview; still counts as storage + streaming
- No cap on apps or end users — only bandwidth/storage

Self-Hosted: Kubernetes, SAML, REST. License World Terrain / OSM Buildings for air-gap. **Google Photorealistic + Bing cannot be used offline.**

---

## 5. Recipes for /planet

### 5.1 Worlds catalog (24 cities) — ion first

`kind: "ion-osm"` + World Terrain, or `kind: "ion-google-photoreal"` where Google coverage is good. Click building → OSM `elementId` highlight (Cesium OSM Buildings properties). No CSDI.

### 5.2 HK HD planet — CSDI first, ion optional floor

Keep `data.map.gov.hk` 3D Spatial Data + 3D Visualisation Map keys from LandsD (`3dmap@landsd.gov.hk`). Optional: World Terrain **under** CSDI if you need a globe outside the vis-map extent. Hide conflicting OSM masses when a CSDI tile is present.

### 5.3 You received a tower IFC (MY CENTRAL)

1. Server job: `POST /v1/assets` `BIM_CAD`, upload `.ifc`/`.rvt`, wait `COMPLETE`.
2. Store `ionAssetId` on the footprint (join by CSUID / lonlat, previous brief).
3. On click: `fromIonAssetId` + `GET /assets/{id}/elements`.
4. Export a DXF/storey cut from the same IFC (IfcOpenShell, not ion) → depthmapXcli VGA (sim brief). ion does not run VGA.

### 5.4 You received photogrammetry of a district

`3D_CAPTURE` + KTX2. Use as A2 overlay. Still paint live TD speeds on a separate vector layer (ion has no traffic).

### 5.5 Unreal / Unity / Omniverse HD client

Same ion asset ids via Cesium for Unreal/Unity/Omniverse plugins. Second client, same tokens. Do not pixel-stream Unreal as the garden tab.

---

## 6. Constraints for the next agent

- `Ion.defaultAccessToken` in the client = **read** only, asset-restricted.
- Write ingest = Netlify/server; `Netlify.env.get("CESIUM_ION_WRITE_TOKEN")` (or the host’s secret store). Never hardcode.
- Do not re-tile CSDI through ion.
- Do not GPL-link depthmapX; ion BIM mesh ≠ VGA heatmap.
- HK: LandsD attribution on CSDI; ion OSM attribution is auto in Cesium software — keep both if both layers show.
- Google Photoreal: enable on account; `globe: false`; watch root-tile quota.
- BIM+Database is **Technology Preview** (APIs may change).
- This garden **links out** to planet. Implement on jubuddy/gghere unless explicitly prototyping here.
- Community plan is not a production licence for a public planet.

---

## 7. One-line briefs

**ion.cesium.com:** dashboard. Code = `api.cesium.com` + `Cesium3DTileset.fromIonAssetId`.  
**HK HD:** still CSDI 3D Tiles.  
**24 cities:** OSM Buildings or Google Photoreal via ion.  
**Got IFC:** BIM/CAD Tiler **with Database** → element query on click.  
**Got photo mesh:** `3D_CAPTURE` 1.1 + KTX2.  
**Not ion:** SUMO, GTFS, depthmapX, Centanet PNGs.  
**Pay:** Commercial+ plus integration talk before shipping a public `/planet`.

ion 是切片和托管，不是行星本体。香港高清仍用地政。24 城用 OSM/Google 底图。拿到 IFC 才用 BIM+数据库做室内可点。车流和空间句法不在 ion 里。
