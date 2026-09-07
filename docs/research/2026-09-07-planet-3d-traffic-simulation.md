# /planet 3D + traffic simulation — AI coding brief

Date: 2026-09-07  
Status: research; **not implemented**  
Companion: `docs/research/2026-09-07-hk-building-clickable-planet.md` · `docs/research/2026-09-07-cesium-ion-planet.md`  
Target: `jubuddy.com/planet` · `gghere.com/hk?district=central-belt`  
Languages: 中文 / English

This file is for an AI coding agent. It maps **production 3D and traffic-simulation software + datasets** onto `/planet`. Do not scrape Centanet floorplan PNGs. Do not GPL-link depthmapX into the web app.

本文件给编程 AI。把生产级 3D / 交通仿真软件和数据接到 `/planet`。不要抓中原平面图。不要把 GPLv3 的 depthmapX 链进网页应用。

---

## 0. What the uploaded video actually is / 上传视频是什么

File: user upload `361_4e9e.mp4` (~62s, 1280×752, 30 fps).

MP4 title metadata (verified with `ffprobe`):

```text
title: depthmapX 0.7.0 - [Option 2:3D View]
artist: Microsoft Game DVR
```

This is **UCL space-syntax software depthmapX**, Windows Game DVR capture, **not** SUMO / VISSIM / Unreal / Cesium.

这是 **UCL 空间句法 depthmapX** 的 3D 视图录屏，不是 SUMO / VISSIM / 虚幻 / Cesium。

Visible UI (frames 0–60s):

| UI | Meaning |
|---|---|
| Menu: File Edit Map Attributes Tools View Window Help | desktop scientific app |
| Index → Visibility Graphs → **VGA Map** | Visibility Graph Analysis grid |
| Drawing Layers → `$0$Buildings` | imported CAD/plan geometry |
| AttributesList → **Gate Counts** selected | agent-sim pedestrian counts per cell |
| Also listed: Connectivity, Isovist Area, Angular Mean/Total Depth, Metric Mean Shortest-Path, Point First/Second Moment | classic VGA metrics |
| Viewport | two floor plates, **red→blue heatmap**, small **humanoid agents** walking |
| Status coords | e.g. `3834 451.656, 416.513` (plan units, not WGS84) |

What it demonstrates for `/planet`:

视频证明的能力：把 **平面几何 → 可视性网格 → 智能体走路 → Gate Counts 热力**。这是 **室内人流 / 可理解性** 层，不是马路车流。接到 `/planet` 的正确位置是 **点进建筑之后**，叠在 LandsD indoor / schematic floor 上。

It is **indoor pedestrian / intelligibility**, not street traffic. On `/planet` it belongs **after building click**, draped on LandsD indoor or a schematic floor.

---

## 1. Split the problem / 先拆层

Do not buy one “3D traffic city” suite and expect it to be `/planet`. Three different engines, three different data contracts.

不要买一套「3D 交通城市」指望直接变行星。三套引擎，三份数据合同。

```
A. 3D city / globe          →  see the place (mesh, tiles, camera)
B. Indoor people            →  walk rooms, heatmaps, gates  ← the video
C. Street + transit traffic →  cars, buses, signals, live speeds
```

`/planet` today is **A** (tiny-planet + footprints). Previous brief added **clickable B geometry**. This brief adds **B simulation + C traffic**, and the **coding-enabled** software that can feed both.

`/planet` 今天是 A。上一份简报加了可点击的 B 几何。这份加 B 仿真 + C 车流，以及能写进产品的软件。

---

## 2. Layer map onto /planet

```
planet camera (existing tiny-planet / Cesium / MapLibre)
  ├─ A1  CSDI 3D Tiles / Overture footprints          [open, HK]
  ├─ A2  optional Unreal / Unity / Omniverse client   [engine, not the web tab]
  ├─ click building
  │     ├─ B0  indoor polygons (LandsD WFS / schematic A–F)
  │     ├─ B1  VGA heatmap (depthmapXcli → CSV)       [the video]
  │     ├─ B2  agent trails (depthmapXcli -ot trails)
  │     └─ B3  optional MassMotion / Viswalk if licensed BIM
  └─ C   street layer (always on at city scale)
        ├─ C0  Road Network v2 + OSM / Overture transport
        ├─ C1  SUMO micro-sim (offline or TraCI stream)
        ├─ C2  live colour: TD speed / JTIS / TDAS
        └─ C3  buses + MTR: GTFS + ETA APIs
```

Web default = **A1 + B0–B2 + C0–C3** in the browser.  
Native “production twin” = same data, Unreal/CARLA/Omniverse as an optional HD client.

网页默认用浏览器栈。原生高清孪生是同一份数据的可选客户端，不是替换 `/planet`。

---

## 3. Software that enables coding / 能写进产品的软件

Ranked by: open + API/CLI + fits a web planet. GPL infection called out.

按「开放 + 可编程 + 能进网页行星」排序。GPL 传染单独标。

### 3.1 Indoor people (matches the video)

| Software | Licence | How you code it | What you get | /planet use |
|---|---|---|---|---|
| **depthmapX** + **depthmapXcli** | **GPLv3** ([SpaceGroupUCL/depthmapX](https://github.com/SpaceGroupUCL/depthmapX)) | **CLI as a sidecar process**, not a library link. Import DXF → VISPREP → VGA → AGENTS → EXPORT csv | VGA metrics, **Gate Counts**, agent **trails.csv** | Precompute indoor heatmaps; stream trails as deck.gl TripsLayer. **Do not statically link** into Next.js/Cesium — GPL would apply to the whole app. Process + consume CSV/JSON is the safe pattern |
| SalaScript | bundled | formulas on attributes | derived columns | optional |
| **momepy** + NetworkX | BSD | Python `gdf_to_nx` / centrality | street/axial-like morphometrics | city-scale syntax on OSM/Overture streets, not full VGA |
| **MassMotion** (Oasys/Arup) | commercial + **SDK** | import IFC/FBX/DWG; SDK for agents | production crowd, stations, malls | only if you have BIM + licence; export agent tracks to JSON |
| **PTV Viswalk** | commercial | COM/API; pairs with VISSIM | pedestrians + vehicles | corridor digital twin, not the free web planet |
| Pedestrian Dynamics | commercial | CityGML/IFC import | crowd | same |

**depthmapXcli pipeline (copy-paste):**

```bash
# 1. DXF floor (from LandsD unit outlines OR traced schematic — never Centanet PNG)
./depthmapXcli -f floor.dxf -o floor.graph

# 2. grid + fill + connectivity
./depthmapXcli -f floor.graph -o floor_prep.graph -m VISPREP -pg 0.4 -pp 12.0,8.0

# 3. VGA
./depthmapXcli -f floor_prep.graph -o floor_vga.graph -m VGA -vm visibility -vl

# 4. agents + gate counts + trails
./depthmapXcli -f floor_vga.graph -o floor_agents.graph -m AGENTS \
  -am standard -ats 5000 -arr 0.1 -alife 1000 \
  -ot graph -ot gatecounts -ot trails

# 5. metric table
./depthmapXcli -f floor_vga.graph -o vga.csv -m EXPORT -em pointmap-data-csv
```

Map `vga.csv` / `gatecounts` cells → WGS84 by anchoring the DXF to the building footprint / indoor `level_polygon`. Store as GeoJSON grid or quantized heatmap PNG + world file.

把单元格用 indoor `level_polygon` 锚到 WGS84。存 GeoJSON 网格或量化热力 PNG。

**Geometry sources for the DXF (legal):**

1. LandsD indoor `unit_outline` / `opening_line` / `windows_line` (public venues only).
2. Your schematic A–F for MY CENTRAL (previous brief) — coarse but legal.
3. Licensed BIM / IFC from owner.
4. **Not** Centanet `newUP` PNGs.

MY CENTRAL has **no** LandsD indoor venue. depthmapX on that tower needs schematic or licensed BIM.

MY CENTRAL 没有地政室内图。depthmapX 只能吃示意几何或授权 BIM。

### 3.2 Street traffic (cars, signals)

| Software | Licence | How you code it | /planet use |
|---|---|---|---|
| **SUMO** | EPL-2.0 | `netconvert`, `duarouter`, **TraCI**, **libsumo** / `pip install libsumo` | **Default micro-sim.** OSM or HK Road Network → `.net.xml`. TraCI emits vehicle x/y/angle each step → WebSocket → deck.gl |
| **MATSim** | GPL | Java; population plans | city-scale demand; convert to SUMO with `matsim_importPlans.py`. GPL — keep as batch, not inlined |
| **PTV VISSIM / VISUM** | commercial | COM, files; SUMO can ingest some VISUM OD | buy only if a government/consultant already owns the HK model |
| **Aimsun** | commercial | API | same |
| **CARLA** | MIT | Python API; **official SUMO co-sim** | HD driving / sensors. Too heavy for the web tab. Optional sister client |
| UrbanFlow-AI | OSS example | FastAPI + SUMO + OSM → browser 3D | pattern to copy, not a dependency |

**SUMO from OSM (coding path):**

```bash
# bbox: Central Belt-ish
osmium extract --bbox 114.148,22.276,114.165,22.290 hk.osm.pbf -o central.osm
netconvert --osm-files central.osm -o central.net.xml \
  --lefthand true --geometry.remove --ramps.guess
# demand: random or GTFS
python $SUMO_HOME/tools/randomTrips.py -n central.net.xml -o trips.xml
duarouter -n central.net.xml -t trips.xml -o routes.rou.xml
sumo -n central.net.xml -r routes.rou.xml --step-length 0.5
```

HK is **left-hand traffic** — always `--lefthand true`.

香港靠左行。SUMO 必须 `--lefthand true`。

**TraCI → planet (shape only):**

```ts
type VehiclePose = {
  id: string;
  lon: number;
  lat: number;
  z?: number;
  heading: number; // deg
  speed: number;   // m/s
  type: "car" | "bus" | "tram" | "ped";
  t: number;       // unix ms
};
```

Browser: **deck.gl `TripsLayer`** or MapLibre custom layer. Do not run SUMO in the browser.

浏览器只播姿态流。不要在浏览器里跑 SUMO。

### 3.3 3D city / globe (see the place)

| Software | Licence | How you code it | /planet use |
|---|---|---|---|
| **CesiumJS** | Apache-2.0 | 3D Tiles, `Cesium3DTileset` | native fit for CSDI `tileset.json` |
| **Cesium for Unreal** | Apache-2.0 plugin | UE physics + 3D Tiles | HD walkable twin; Project Anywhere pattern |
| **Cesium for Unity** | Apache-2.0 | same | mobile/VR client |
| **Cesium for Omniverse** | Apache-2.0 | USD + ray trace | studio / AI analytics, not the garden tab |
| **MapLibre GL JS** + **deck.gl `Tile3DLayer`** | BSD/MIT | web, lighter than Cesium | if planet stays MapLibre |
| **Cesium ion** (`ion.cesium.com`) | SaaS / Self-Hosted | REST `api.cesium.com`: tile IFC/RVT/OBJ/LAS; OSM Buildings; Google Photoreal; BIM element query | **Ingest + 24-city fallback.** Not a replacement for CSDI HK tiles. Full brief: `docs/research/2026-09-07-cesium-ion-planet.md` |
| **Esri CityEngine** | commercial | CGA procedural; export FBX/USD/SLPK; game-engine plugins | generate missing LOD2 from footprints + rules. Not required if CSDI mesh exists |
| **IfcOpenShell** / That Open (IFC.js) | LGPL / MPL | BIM in the browser | indoor BIM viewer **inside** a clicked building |

CSDI already streams Cesium 3D Tiles (previous brief). Production “got the dataset” for A is mostly **key + attribution**, not a new engine.

CSDI 已经能流 3D Tiles。A 层生产数据主要是 **申请 key + 署名**，不是换引擎。

### 3.4 What not to make the web planet

| Tempting | Why not as `/planet` default |
|---|---|
| Unreal pixel-stream of whole HK | GPU + licence + not “no account / browser tab” |
| CARLA town | synthetic maps; co-sim with SUMO is research, not 24-city catalog |
| VISSIM GUI | closed, desktop |
| depthmapX Qt GUI | the video; use **cli** in CI instead |

Keep those as **optional HD clients** that subscribe to the same pose/heatmap APIs.

它们可以当订阅同一套姿态/热力 API 的高清客户端。

---

## 4. Datasets — open now vs production-level / 现成开放 vs 生产级

### 4.1 Already free (HK) — wire first

| Dataset | Role | Where |
|---|---|---|
| CSDI 3D Visualisation / Spatial Data Tiles | A mesh | `data.map.gov.hk/api/3d-data/...` + key from `3dmap@landsd.gov.hk` |
| LandsD 3D Indoor WFS | B walls/rooms | 689 venues + 98 MTR (previous brief) |
| 3D Pedestrian Network + Indoor Network | B/C walk graph | data.gov.hk / CSDI GeoJSON |
| 3D Pedestrian Route Search | A↔B navigation | `mapapi.hkmapservice.gov.hk/PedRoute/...` |
| **Road Network (2nd Generation)** | C topology: turns, restrictions, parking | https://data.gov.hk/en-data/dataset/hk-td-tis_15-road-network-v2 |
| Journey time indicators v2 | live corridor times, ~2 min | https://data.gov.hk/en-data/dataset/hk-td-sm_8-journey-time-indicators-v2 |
| Speed map / speed map panels v2 | live speeds ~5 min | data.gov.hk TD |
| **TDAS** average speed + journey time | route forecast JSON ~5 min | https://data.gov.hk/en-data/dataset/hk-td-tis_28-traffic-data-tdas · spec `https://tdas-api.hkemobility.gov.hk/tdas/specification/TD_TDAS_API_Specifications.pdf` |
| Public transport **GTFS** | buses/GMB/ferry schedules | https://data.gov.hk/en-data/dataset/hk-td-tis_11-pt-headway-en |
| Routes + fares GeoJSON | line geometry | https://data.gov.hk/en-data/dataset/hk-td-tis_23-routes-fares-geojson |
| KMB/LWB ETA JSON | live buses | https://data.gov.hk/en-data/dataset/hk-td-tis_21-etakmb |
| Citybus ETA | `rt.data.gov.hk/v2/transport/citybus/` | TD / operator |
| MTR next train | `rt.data.gov.hk/v1/transport/mtr/getSchedule.php` | open data |
| Overture buildings + transportation | global A/C | GeoParquet |
| OSM | streets, buildings | ODbL |

These are enough for a **live-coloured SUMO playback** on Central Belt without buying VISSIM.

这些已经够中环带做 **SUMO 回放 + 实时路段上色**，不必买 VISSIM。

### 4.2 Production-level you might “get” later

| Asset | Why it changes the product | How it enters /planet |
|---|---|---|
| Licensed **IFC / Revit** of a tower (MY CENTRAL) | true indoor + depthmapX/MassMotion | Cesium Design Tiler → 3D Tiles inside the footprint; DXF/IFC → depthmapXcli |
| Consultant **VISSIM/Aimsun** HK Island model | calibrated signals, lanes | export routes/OD → SUMO or stream via their API; still render in Cesium |
| **Mobile mapping** point cloud (LandsD MMS is **paid**) | street-level mesh | 3D Tiles; not required if CSDI vis-map exists |
| **GTFS-Realtime** beyond operator ETAs | vehicle positions | TripsLayer |
| Census / TPU OD matrices | MATSim / SUMO demand | batch, not runtime |
| Private **Centanet 户型** licence | unit rasters | overlay only; still not VGA geometry |

“Production dataset” for **C** in HK is mostly **Road Network v2 + live TD APIs + GTFS**, not a secret traffic file. The scarce production asset is **calibrated demand + signal timing** (usually a paid model).

香港 C 层生产数据主要是路网二代 + 实时 TD + GTFS。稀缺的是 **标定出行需求 + 信号配时**（通常是顾问模型）。

---

## 5. Integration recipes / 接到 `/planet` 的做法

### 5.1 Recipe 1 — Indoor heatmap like the video (highest leverage from the upload)

**Input:** LandsD `unit_outline` of Sheung Wan MSB or The Center (has indoor).  
**Batch (CI or Netlify function, not client):**

1. WFS → GeoJSON → DXF (ogr2ogr).
2. depthmapXcli VISPREP + VGA + AGENTS.
3. Join grid to WGS84.
4. Upload `heatmap.geojson` + `trails.json` to blobs.

**Runtime:** on building click, fetch heatmap, colour `unit_polygon`s or a grid overlay. Optional: play trails as looping agents (InstancedMesh / deck.gl).

**Seed for MY CENTRAL:** schematic six pads A–F, one VGA per typical floor band (previous brief §3.3). Honest: coarse.

### 5.2 Recipe 2 — Street ants on Central Belt (SUMO + live colour)

**Input:** OSM or Road Network v2 clipped to Central Belt.  
**Batch:** SUMO 15–60 min scenario, dump `fcd-output` (floating car data) XML/CSV.  
**Runtime:** either

- pre-baked FCD as TripsLayer (cheap, works on Vercel), or
- a small always-on TraCI worker (not a Netlify snapshot) pushing WebSocket poses.

**Live overlay:** every 2–5 min paint SUMO edges from JTIS/TDAS speeds. Simulation stays synthetic; **colour is real**.

仿真可以是合成的，**路段颜色用真实时速度**。这对 `/planet` 比「全城真车」更可交付。

### 5.3 Recipe 3 — Transit ghosts

GTFS shapes + KMB/Citybus/MTR ETA → interpolate bus/train sprites along routes. No SUMO required. This is the fastest “the city is alive” win.

这是最快的「城市在动」：不必 SUMO。

### 5.4 Recipe 4 — HD twin (only if you got Unreal + production mesh)

Cesium for Unreal loads CSDI tiles. SUMO TraCI drives vehicle actors. Indoor: IFC tiled with Cesium Design Tiler. Same APIs as the web planet. Pixel-stream or native download is a **second client**, keep the garden as CesiumJS.

同一套 API，第二个客户端。园地网页仍是 CesiumJS。

---

## 6. Suggested types (exhaustive switches)

```ts
type PlanetSimLayer =
  | { kind: "tileset"; url: string; attribution: "landsd" | "overture" | "osm" }
  | { kind: "ion-osm" }
  | { kind: "ion-google-photoreal" }
  | { kind: "ion-asset"; assetId: number }
  | { kind: "indoor-wfs"; venueId: string; source: "landsd-building" | "landsd-mtr" }
  | { kind: "vga-heatmap"; levelId: string; url: string; metric: VgaMetric }
  | { kind: "agent-trails"; levelId: string; url: string }
  | { kind: "sumo-fcd"; scenarioId: string; url: string }
  | { kind: "live-speed"; source: "jtis" | "tdas" | "speedmap" }
  | { kind: "transit-gtfs"; operator: "kmb" | "citybus" | "mtr" | "gmb" };

type VgaMetric =
  | "connectivity"
  | "isovistArea"
  | "angularMeanDepth"
  | "metricMeanShortestPath"
  | "gateCounts";

function assertNever(x: never): never {
  throw new Error(String(x));
}
```

---

## 7. Implementation order

1. **Transit ghosts** on existing planet (GTFS + one ETA). Proves motion without a sim cluster.
2. **Live speed colour** on Overture/OSM streets (JTIS/TDAS).
3. **Indoor VGA** on one LandsD venue (Sheung Wan MSB or The Center) via depthmapXcli sidecar. This **ports the video**.
4. **SUMO FCD playback** for Central Belt, left-hand, 10–20 minutes looped.
5. TraCI worker only if you need interactive signals.
6. Unreal/CARLA only after 1–4 exist as APIs.

Do not start with Omniverse.

不要从 Omniverse 开干。

---

## 8. Constraints for the next agent

- depthmapX is **GPLv3**: CLI sidecar + CSV in; no npm wrap of the C++ lib.
- SUMO is **EPL-2.0**: safer to embed tools; still run off-browser.
- LandsD tiles: attribution `Map from Lands Department`, own API key.
- Left-hand traffic.
- MY CENTRAL: no indoor WFS; schematic or licensed BIM only.
- No Centanet PNG → DXF tracer.
- This garden repo currently **links out** to planet. Implement sim on jubuddy/gghere unless explicitly prototyping here.

---

## 9. One-line briefs

**Video:** depthmapX 0.7.0 3D VGA + agents + Gate Counts.  
**Port:** indoor heatmap/trails after building click.  
**City traffic:** SUMO (code) + HK Road Network v2 + TD live speeds + GTFS/ETA (data).  
**3D:** CSDI 3D Tiles in CesiumJS (HK HD) / Cesium ion OSM or Google Photoreal (24 cities) / ion BIM+Database when you have IFC. HD client: Cesium for Unreal. See `2026-09-07-cesium-ion-planet.md`.  
**Production scarce asset:** calibrated demand + signal timing + per-tower IFC — not another globe engine.

视频是空间句法室内人流。接到 `/planet` 是点楼之后的热力/轨迹。马路用 SUMO + 路网二代 + 运输署实时 + GTFS。三维用地政 3D Tiles。真正稀缺的是标定需求和楼宇 IFC，不是再买一个地球引擎。
