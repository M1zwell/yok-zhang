# 🏛 Landmark buildings — production research, marketing pack, enhancement plan

**Date:** 2026-09-09  
**Live:** `https://jubuddy.com/planet` · `https://gghere.com/hk?district=central-belt` (same bundle `assets/index-jHrC0rri.js` + `PlanetRoute-sDANDcwB.js` + `userSkins-32Sm4g-s.js`)  
**Production SHA (Vercel):** `f577e8618ed3311487adbd5bf15738aca42d838e` (`Jubit-AI/jubuddy-game` @ `gghere.com`)  
**Registry source:** GitHub-notify `d3e4561` / `8998ea` — **442 curated · 382 named**  
**Default globe:** Hong Kong HD (CSDI 3D tiles)  
**This garden (`ichina.co`):** outbound links only. Do **not** implement planet/sim here. Specs → jubuddy / gghere (`Jubit-AI/jubuddy-game`, private).

**Related briefs (same PR / thread):**  
- Clickable buildings + MY CENTRAL: `docs/research/2026-09-07-hk-building-clickable-planet.md`  
- 3D + traffic sim: `docs/research/2026-09-07-planet-3d-traffic-simulation.md`  
- Cesium ion: `docs/research/2026-09-07-cesium-ion-planet.md`

> **2026-09-14 update below supersedes parts of this file.** Bundle is now `index-BsnyDxsX.js` + `PlanetRoute-e5aQHIHY.js` + `userSkins-y3w6rNso.js` + `userBuildings-DYz5FI-5.js`. Three ADR-0318 slices shipped 2026-09-11; interiors are no longer "parked" but designed (Marble rooms, not shipped). Jump to [§ 2026-09-14 update](#2026-09-14-update--the-center-card).

---

# 2026-09-14 update — The Center card

## 中文

### 用户看到的卡（2026-09-14 生产）

```
Well hello there! You've tapped right on The Center, our striking 346-metre tall
neighbour. Around here, it's a pleasant 27C with low air quality, but do note our …

💬 Ask about this spot
live data: HK gov open data

🏛 The Center
Height 346 m · ≈ 108 storeys
Footprint 50 m
Crowns Central · Cube-Belt
🎫 Stamp 13 / 442 · New stamp
🌌 Sky above it
📸 Photo
🎨 Re-skin
🏢 Real building
```

比 09-09 多了三样：**开场白**、**💬 Ask about this spot**、**🏢 Real building**。Re-skin 内部也变了。

### 1. 开场白 + Ask（PlanetChatPanel，`/api/planet/ask`）

- 系统提示（bundle 原文）："You are the friendly local voice of a tiny toy planet of Hong Kong … a neighbour who loves this city, never a brochure."
- 地标上下文注入："The pin is on a landmark: The Center, about 346 m tall."
- 实时读数来自 **`/api/hk/scan`**：气温 + 站名、AQHI + 等级、UV、雨量峰值、生效警告、停车场空位、最近站下一班。页脚 `live data: HK gov open data`。
- 硬规则：**绝不编造实时数字**；不点名运输营办商/线路/八达通；≤ 90 字；无 markdown；用用户语言回答（EN / 繁中 / 韩 / 日 / 泰）。
- 附近新闻标题可引用（注明媒体，不给 URL；"near, not at"）。
- 模型芯片：Gemini 2.5 Flash（默认）· DeepSeek V4.1 Flash · Nemotron 3 Super · MiniMax M3 · Kimi K2.5 fast。
- 频率：两次提问间隔 ≥ 3 s，每会话 40 次。
- 非港星球：无实时层，提示改为"Live readings do not cover this spot"。

### 2. 🎨 Re-skin 升级（ADR-0318 S2，#1525，`143803` / `79eaf1`）

| 模式 | 规则 |
|------|------|
| **Poster — the whole tower** | 任意图 ≤ **1 MB**，覆盖塔的每一面，裁切填满；faceted 塔也支持 |
| **Tiles** | 1×（原 256 方块）或 **5×** 大瓷片 |

提示语改为 "shown to others only when you publish"。别人的海报以半分辨率绘制（`aae213`）。仍然：无 logo / 招牌。

### 3. 🏢 Real building（ADR-0318 S3，#1526，`91939b`，2026-09-11）

**这就是 09-09 计划里的 B「替换网格」——已上线，而且比 glTF 上传更激进：一张照片 → 3D。**

- 文案："One clear photo of the whole building · forged into 3D in 5–15 minutes · private until you publish · **Pro**"。
- 流程：`POST /api/forge/source`（≤ 3 MiB，6 次/分，magic-byte 验型，客户端先重编 JPEG 所以 **EXIF 不出手机**）→ `forge_jobs.product='building'`, `subject=lm-*` → 轮询 → 落地 `planet_creations kind='building'` → `GET|DELETE /api/planet/buildings/{lm-id}`（签名 1 h，仅本人）。
- 引擎 `landmarkBuildingMeshes.ts`：toon 重着色、**等比塞进原高度/底盘**（不拉伸）、冠顶重新坐到新顶。是 **dressing**，不是 lot 状态：攻城倒塌逻辑不变；拆掉 = 走 lot rebuild。
- 优先级：自己的 building > 自己的 skin；别人的公开 building 以幽灵出现，标 "Building by @name"。
- **Restore the curated tower** 一键还原。
- 迁移：`20260911000001_planet_creation_windows.sql` + `20260911000002_forge_buildings.sql` 必须先跑再推生产。

### 4. 付费公开窗口（ADR-0318 S1，#1524，`6f0b95`）

- 皮肤 / 重建 / 建筑三种 creation 共用一张 sheet：**claim → charge → paid**。
- 窗口：1 小时 / 1 天 / 1 周 / 1 个月 / 1 年，单位 **ju**。私有永远免费；长窗口需 Pro 或 Max。
- 计时从管理员批准开始；被拒或换图即作废，**不退款**。
- 一座塔同时只有一个持有者（"Someone else holds this tower for now"）；每玩家有持有上限。
- 管理员：账户页 "Review planet creations"，队列显示缩略图 + GLB 链接，留在 gghere。

### 5. 室内：从「停工」到「已设计」

- 规格 `2026-09-12-marble-landmark-interiors-design.md`（#1553）：地标卡加 **Enter**，打开懒加载 **360 环视房间**（看、盖章、离开），7 座有策展地标的城市各一间旗舰。
- 全景来源用 ≤ 2,000 credit 的实验梯对比免费引擎内 toon 控制；World Labs **Marble** 港探针已花 310 credit；可行走 Spark splat 房间延后。
- 计划 `2026-09-13-marble-landmark-rooms-{product,tooling}.md`：ADR-0328（拟）、`LANDMARK_ROOMS` 注册表、`roomVisits` 印章、`PlanetScene.setSuspended`。
- **尚未上线。** 这是"玩具房间"，不是测绘几何；与 clickable 简报里"仅当 LandsD IFC 存在才进室内"不冲突——那是另一条（数据层）路。

### 6. 同期其他

Copernicus GLO-30 地形（ADR-0319）· 24 步玩具日太阳 · 14 种 tile gzip-at-rest · 52 城之间的 Ether Sea · Giant Queen raid（设计中）。

### 09-09 计划对账

| 09-09 计划 | 09-14 状态 |
|-----------|-----------|
| A Tune：完好塔的套件编辑 | **仍缺**。Rebuild 仍需先倒塌 |
| B Mesh replace（glTF / ion BIM） | **已上线**为 Real building（照片→3D，Pro） |
| C UV 重复 / 画廊 / 邮票卡 | Poster + 5× Tiles **已上线**；画廊、邮票卡仍缺 |
| D 补名 ~60 | 未见变化 |
| E 集邮任务 / 拍照挑战 | 未见；但 **ju 窗口经济**已成创作经济骨架 |
| F 不声称室内 | 室内已有设计与计划，**未上线**——继续不对外承诺 |

### 修订后的增强计划

1. **Tune（最高优先，未变）**：完好塔也能改层级 / 冠顶 / 高度% / 色调；走与 skin 相同的 私有→窗口 发布。
2. **Real building 精修**：
   - 上传 **glTF/GLB** 直通道（已有模型的人不必绕过照片→3D）；
   - ion BIM tileset 作为 Pro+ 来源（接 Cesium 简报）；
   - 5–15 min 等待期给进度 + 离开后通知；
   - 明确照片版权与"无招牌"规则在 forge 侧再过一次审核。
3. **Re-skin**：过审公开画廊 / 一键试穿；Poster 的按层重复选项。
4. **Ask 深化**：把 stamp 与 Ask 绑定（"你在这座塔下问过天气"）；地标卡里直接显示 AQHI / 温度芯片而不只在开场白。
5. **室内**：按 Marble 计划出 1 间港旗舰（The Center 或 Jardine House）作 E0；进门 = 新印章类型 `roomVisits`。
6. **命名**：继续两源规则；`lm-hsbc` 保持空白。
7. **不做**：Centanet 描图；每栋 OSM 换皮；在本园实现；对外称室内已上线。

### 营销文案修订

**标题：** Walk up to the real tower. It talks back. Stamp it. Dress it. Forge it.

**正文：** 走到 The Center 脚下，星球先开口——346 米、此刻 27 度、空气质素低，全部来自香港政府开放数据，绝不编数。问它附近的车、天气、值得看什么。盖一枚戳（13 / 442）。给塔换海报或瓷片；或者拍一张真楼照片，5–15 分钟锻成 3D 站在原位。默认只有你看得见；花 ju 买一小时到一年的公开窗口，管理员点头后全城可见。

**不承诺：** 进室内（设计中）、改层数、每栋楼都能锻。

## English

### What the card shows now (2026-09-14)

Three additions versus 09-09: an **AI greeting**, **💬 Ask about this spot**, **🏢 Real building**. Re-skin changed inside.

**Greeting + Ask** (`/api/planet/ask`): system prompt "friendly local voice of a tiny toy planet of Hong Kong … never a brochure"; landmark injected as "The pin is on a landmark: The Center, about 346 m tall"; live readings from `/api/hk/scan` (temp + station, AQHI + band, UV, rain peak, warnings, car parks, next departures); rules: **never invent a live number**, no operator/route/fare-card names, under 90 words, reply in the user's language. Models: Gemini 2.5 Flash default, DeepSeek V4.1 Flash, Nemotron 3 Super, MiniMax M3, Kimi K2.5 fast. 3 s between asks, 40 per session.

**Re-skin (ADR-0318 S2, #1525):** Poster mode (any picture ≤ 1 MB, every face, cropped to fill, faceted towers too) or Tiles 1× / 5×. Others' posters drawn at half res.

**Real building (ADR-0318 S3, #1526, 2026-09-11):** one photo → GLB in 5–15 min, **Pro**. `POST /api/forge/source` (≤ 3 MiB, 6/min, magic-byte typed, client re-encodes JPEG so EXIF never leaves the phone) → `forge_jobs.product='building'` → `GET|DELETE /api/planet/buildings/{lm-id}`. Engine: toon re-shade, uniform fit under height/footprint, crown re-seated. A dressing, not lot state; own building beats own skin; others' public buildings are ghosts "Building by @name"; **Restore the curated tower**. This *is* plan item B from 09-09 — shipped, and more aggressive than glTF upload.

**Paid public windows (ADR-0318 S1, #1524):** claim → charge → paid; 1 h / 1 d / 1 w / 1 m / 1 y in **ju**; private stays free; longer windows need Pro or Max; clock starts on admin approval; rejection or a new picture forfeits, no refunds; one holder per tower; per-player caps; admin queue "Review planet creations".

**Interiors:** no longer parked. Spec `2026-09-12-marble-landmark-interiors-design.md` (#1553): **Enter** on the scan card → lazy 360 look-around room (look, stamp, leave), one flagship per curated city (7). World Labs Marble probe done (310 credits); ≤ 2,000-credit ladder vs free in-engine toon control; walkable Spark splats deferred. Plans 2026-09-13 (ADR-0328 proposed, `LANDMARK_ROOMS`, `roomVisits`). **Not shipped.** Toy room, not survey geometry.

### Reconciled plan

| 09-09 item | 09-14 |
|---|---|
| A Tune (standing kit edit) | **Still missing** — top priority |
| B Mesh replace | **Shipped** as Real building (photo → 3D, Pro) |
| C UV repeat / gallery / stamp card | Poster + 5× tiles shipped; gallery + stamp card missing |
| D Name ~60 | No change seen |
| E Quests | Missing; ju windows now form the creator economy |
| F Don't claim interiors | Designed + planned, not live — keep not claiming |

**Next:** Tune → glTF/GLB direct lane + ion BIM lane for Real building → moderated skin gallery → bind stamps to Ask → one HK flagship Marble room (The Center or Jardine House) → keep two-source naming.

**Headline:** Walk up to the real tower. It talks back. Stamp it. Dress it. Forge it.

---

# 中文

## 一句话

走到 **🏛 Landmark (G)** 面前，打开一张**真楼名片**（名字、高度、层数、底盘、Cube-Belt、集邮进度），可以**换外观（Re-skin）**、抬头看天、拍照。这是**策展地标相册**，不是每栋 OSM 楼都能改、换模型或进室内。

## 生产里实际有什么（2026-09-09 实测 + GitHub-notify）

### 走近 → 开窗

步行靠近策展地标时，PinScanCard 出现 **🏛 Landmark (G)** 行（用户描述的「开 windows」）。同一张卡上已上线：

| 控件 | 生产行为 |
|------|----------|
| 标题 + 副标题 | 例如 **Jardine House** · Height 178 m · ≈ 56 storeys · Footprint 43 m（层数由高度推算） |
| Crowns Central · Cube-Belt | i18n `planet.scan.landmark.crowns` = “Crowns {place}” + 区带 |
| 🎫 Stamp n / 442 · New stamp | 第一次走近收入集邮册；**442** 是策展总数 |
| 🌌 Sky above it | 打开观星 HUD（拖、滚轮缩放、Esc） |
| 📸 Photo | 保存当前视角截图 |
| 🎨 Re-skin | **ADR-0308**：把你的图贴到**这座地标网格**上（换皮，不是换模型） |

同卡还有、用户截图未点名的：

- **Rebuild**（ADR-0307）：只在**攻城倒塌后的空地**上用套件重建（层数档、冠顶、高度%、色调），**不是**站立中的楼的编辑器。
- **Creations**：发布 / 撤回 / 删除；私有 → 待审 → 公开 / 拒绝。别人走近可见 “Rebuilt by @name” / “Skin by @name”。**室内明确停工**（目录是岛屿/warren，不是楼内）。

### 注册表规模（ADR-0315 `d3e4561` / `8998ea`）

| 圈 | 数量 | 说明 |
|----|------|------|
| 策展地标总计 | **442** | 集邮分母 |
| 已具实名 | **382** | 地理名，禁止品牌；`brandGuard`：`scrubBrands(name) === name` |
| 香港岛+九龙 | **183** | 6 种 archetype；高度约 90% 来自 CSDI |
| 京都 | **120** | 高度来自 PLATEAU（`e6375c`） |
| 东京 | **105** | 同上 |
| 非港 240 张卡 | 多数仍瘦 | 有名 + 社区行，缺港那种完整测高句 |

**唯一名或无名**：两源对齐（距离 + slug，>5 m 不跟）。**`lm-hsbc` 故意无名**——最近 OSM「Cheung Kong Center」95 m，贴上去会错标。Jardine House 在批量命名前已由 `poi/` sidecar 上线，所以用户看到的 178 m / 56 层 / 43 m 是真测高，不是占位。

### Re-skin 为何「很有用」但仍不是编辑楼

生产文案：*Your kit on the tower* / 换外观。规则：方图、**不要 logo/招牌**、**仅自己可见**（未发布审核前）。

技术（commit `c5bdde` / `d85efd`，chunk `userSkins-32Sm4g-s.js`）：

- 登录后才持久化。`POST /api/planet/skins` `{landmarkId, png}`；`GET`/`DELETE /api/planet/skins/{id}`。
- `landmarkId` `/^lm-[a-z0-9-]{1,64}$/`。PNG ≤ **300 KB**，解码边 **256**。缓存 50 min。表 `planet_skins`。
- **纹理裹在现有地标网格上**。不是换 mesh、不是改 footprint/高度、不是 IFC/BIM 替换。

所以用户判断成立：**没有站立楼的几何编辑、没有换成自定义 3D、没有室内、没有其它深度游戏动词**。Rebuild 要先打塌。普通 **Building** 行更弱（底盘宽×深、高度/层数，或 “Height not surveyed here”），不能 Re-skin。

生产文案（bundle i18n，EN / 简中）：

| key | EN | 简中 |
|-----|----|------|
| `planet.scan.landmark` | Landmark | 地标 |
| `…crowns` | Crowns {place} | {place}的地标 |
| `…stamp` | Stamp {n} / {total} | 印章 {n} / {total} |
| `…stampNew` | New stamp | 新印章 |
| `…sky` | Sky above it | 头顶的星空 |
| `…photo` | Photo | 拍照 |
| `planet.scan.skin` | Re-skin | 换外观 |
| `…sheet` | Your kit on the tower | 给这座塔换上你的外观 |
| `…hint` | A square tile works best · no logos or signage · yours only | 正方形贴图效果最好 · 不能有标志或招牌 · 仅自己可见 |
| `planet.scan.lot.rebuild` | Rebuild · {price} 🪙 | 重建 · {price} 🪙 |

## 营销介绍（对外可用）

**标题建议：** Walk up to the real tower. Stamp it. Skin it. Look up.

**正文（可直接贴落地页 / 邮件）：**

香港 HD 星球上，策展的 442 座地标不是图钉——你要**走到楼跟前**。Jardine House 会报出 178 米、约 56 层、43 米底盘，以及它所属的 Cube-Belt。第一次走近，🎫 盖一枚新戳（Stamp 3 / 442）。抬头 🌌 看这座楼顶上的天。📸 把此刻拍下来。🎨 Re-skin：把你的方图贴上塔身——没有招牌、没有广告、默认只有你看得见。城市对所有人仍是同一座城；你的皮是私人的，直到你选择发布、过审。

这不是「点击地图上的多边形」。这是**走近真楼 → 开窗 → 集邮 + 换皮**。382 座已用地理实名（不是品牌）。剩下无名的宁可空着，也不把隔壁楼的名字贴错。

**不要对外承诺：** 进室内、改层数、换整栋 3D、把每栋 OSM 楼都变成 Landmark、HSBC 总部已命名。

**一句定位：** 地标是相册与皮肤，不是建筑 CAD。

## 增强 / 精修计划（给 jubuddy，不在本园实现）

### A. 站立中的楼：套件编辑（最高杠杆）

今天 Rebuild 被攻城门控。用户要的是：**走近完好的 Jardine House 也能改套件**（层数档、冠顶 flat/spire/dome/ring、高度%、色调），不必先拆。

- 新动词：**Tune** / 微调 —— 仅自己可见，或走与 skin 相同的审核发布。
- 与 Re-skin 正交：Tune = 参数化 mesh；Re-skin = 贴图。两者可叠。
- **不要**开放任意 CSG/顶点编辑（会毁掉 Cube-Belt 可读性）。

### B. 替换网格（第二阶段，接 Cesium ion 简报）

Re-skin 不够时：用户或策展上传 glTF / ion BIM tileset，**整栋替换**该 `lm-*` 的 mesh，保留 stamp id 与相册进度。

- 体积预算、原点对齐 footprint、禁止超高广告牌。
- 仅 `lm-*`，禁止对普通 Building 行开放（否则 4.5M 足迹不可运营）。
- 港室内：仅当 LandsD Indoor WFS / IFC 对该 venue 存在时才「进入」（见 clickable 简报）。MY CENTRAL **不在** 689 个免费场馆里。

### C. Re-skin 精修

- UV：按层重复窗格，避免 256² 拉花整面墙。
- 画廊：过审公开皮肤可浏览 / 试用（仍无 logo）。
- 导出：邮票卡（名 + 戳 + 皮）可分享。
- 未登录：本地预览，登录后写入 `planet_skins`。

### D. 命名与卡片完整度

- 继续两源规则补全约 60 个无名港/日地标；**保持 `lm-hsbc` 无名直到有不歧义的源**。
- 非港 240 张卡补高度句（PLATEAU 已部分接入）。
- Landmark vs Building：UI 写清「只有策展塔能换皮」。

### E. 游戏动词（不把 Building 升级成 Landmark）

- 集邮任务 / 区带收集（Central Cube-Belt 全戳）。
- 拍照挑战：指定方位拍 Jardine House。
- Sky 与 stamp 绑定：「在这座楼顶看过狮子座」。
- Rebuild 仍走攻城经济；Tune 走创作经济。不要混成一个按钮。

### F. 明确不做

- 不把 Centanet 平面图描进星球（版权）。
- 不把每栋 OSM 楼做成可换皮 Landmark。
- 不在 ichina.co 花园实现。
- 不声称室内已上线。

## 验收（营销材料 vs 生产）

| 说法 | 生产 |
|------|------|
| 走近 Jardine House 开窗 | 是 |
| Stamp n/442 | 是（442 策展） |
| Re-skin 私有贴图 | 是（ADR-0308） |
| Sky / Photo | 是 |
| 改站立楼几何 | **否** |
| 换自定义 3D | **否** |
| 进室内 | **否**（明确停工） |
| 382 地理实名 | 是；`lm-hsbc` 无名 |

---

# English

## One line

Walk up to a **🏛 Landmark (G)**. The card is a **real tower dossier** (name, height, storeys, footprint, Cube-Belt, stamp album). **Re-skin** wraps *your* image on *that* mesh. This is a **curated landmark album**, not an editor for every OSM footprint.

## What production actually ships (2026-09-09)

Approach a curated landmark → **LandmarkRow** on **PinScanCard**. Live controls match the user report: Jardine House 178 m · ≈ 56 storeys · footprint 43 m; Crowns Central · Cube-Belt; Stamp 3/442 · New stamp; Sky above it; Photo; Re-skin.

Also on the same card (not in the screenshot list): **Rebuild** only after siege (ADR-0307) — kit on a **fallen lot**, not a standing tower. **Creations** publish/withdraw/delete (private → review → public/rejected). Interiors **explicitly parked**.

**Registry:** 442 curated landmarks (183 HK Island+Kowloon, 120 Kyoto, 105 Tokyo). **382 named** with geographic names, brand-scrubbed, unique-or-nothing (two-source: proximity + slug; skip >5 m). **`lm-hsbc` ships unnamed** (nearest OSM “Cheung Kong Center” at 95 m would mislabel). Jardine House was named via `poi/` sidecar before the bulk pass, so its height card is real CSDI-class survey, not a stub.

**Re-skin (ADR-0308):** square PNG, no logos/signage, yours-only until published+moderated. Sign-in to persist. `POST /api/planet/skins` `{landmarkId, png}`; PNG ≤ 300 KB, decode 256 px; `planet_skins`; 50 min cache. **Texture wrap on the existing landmark mesh** — not mesh replace, not geometry edit.

Generic **Building** rows are weaker (footprint w×d, height/floors, or “Height not surveyed”) and **cannot** re-skin.

The user’s gap is accurate: **no standing-building edit, no replace-with-custom-3D, no indoor enter, no deep game verbs on the tower.**

## Marketing intro (paste-ready)

**Headline:** Walk up to the real tower. Stamp it. Skin it. Look up.

**Body:** On the Hong Kong HD planet, 442 curated landmarks are not map pins — you **walk to the door**. Jardine House reads 178 m, about 56 storeys, a 43 m footprint, and the Cube-Belt it crowns. First visit: a new 🎫 stamp (3 / 442). Look 🌌 at the sky *above this roof*. 📸 Keep the view. 🎨 Re-skin: your square image on the tower — no logos, no ads, private until you publish and pass review. The city stays one city for everyone; your skin is yours.

This is not “click a polygon.” It is **approach → open the window → collect + dress**. 382 towers carry geographic names, not brands. Unnamed landmarks stay unnamed rather than steal the neighbour’s title.

**Do not promise:** interiors, storey editing, full 3D replace, every OSM building as a Landmark, or a named HSBC HQ.

**Positioning line:** Landmarks are an album and a skin, not CAD.

## Enhancement / refinement plan (jubuddy, not this garden)

1. **Tune (standing kit)** — same rebuild parameters on an intact tower, private or moderated. Orthogonal to Re-skin. No freeform CSG.
2. **Mesh replace** — glTF / ion BIM for `lm-*` only; keep stamp id; volume + origin guards. Indoor enter only when LandsD WFS/IFC exists for that venue (MY CENTRAL is **not** in the 689 free indoor sites).
3. **Re-skin polish** — floor-repeating UVs; moderated public gallery; shareable stamp cards; local preview before sign-in.
4. **Names + cards** — finish ~60 unnamed under two-source rule; keep `lm-hsbc` blank until a non-ambiguous source; fill height lines on 240 non-HK cards; UI copy: only curated towers get skins.
5. **Game verbs without collapsing Building→Landmark** — district stamp quests, photo challenges, sky+stamp binding. Rebuild stays siege economy; Tune stays creation economy.
6. **Won’t** — Centanet floorplan scrape; skin every OSM footprint; implement in this garden; claim interiors live.

## Handoff

Implement on jubuddy / gghere. This file is the marketing + product brief for `yying2010@gmail.com`.
