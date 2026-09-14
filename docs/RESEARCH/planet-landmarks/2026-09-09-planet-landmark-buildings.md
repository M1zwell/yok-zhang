# 🏛 Landmark buildings — production research, marketing pack, enhancement plan

**Date:** 2026-09-09  
**Live:** `https://jubuddy.com/planet` · `https://gghere.com/hk?district=central-belt` (same bundle `assets/index-jHrC0rri.js` + `PlanetRoute-sDANDcwB.js` + `userSkins-32Sm4g-s.js`)  
**Production SHA (Vercel):** `f577e8618ed3311487adbd5bf15738aca42d838e` (`Jubit-AI/jubuddy-game` @ `gghere.com`)  
**Registry source:** GitHub-notify `d3e4561` / `8998ea` — **442 curated · 382 named**  
**Default globe:** Hong Kong HD (CSDI 3D tiles)  
**This garden (`ichina.co`):** outbound links only. Do **not** implement planet/sim here. Specs → jubuddy / gghere (`Jubit-AI/jubuddy-game`, private).

**Related briefs (same PR / thread):**  
- Clickable buildings + MY CENTRAL: `docs/RESEARCH/planet-landmarks/2026-09-07-hk-building-clickable-planet.md`  
- 3D + traffic sim: `docs/RESEARCH/planet-landmarks/2026-09-07-planet-3d-traffic-simulation.md`  
- Cesium ion: `docs/RESEARCH/planet-landmarks/2026-09-07-cesium-ion-planet.md`

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

# 🏢 Real building — sheet & flow refinement (2026-09-14)

Spec for `Jubit-AI/jubuddy-game` (`apps/web/src/planet/scan/BuildingSheet.tsx`, `lib/forgeClient.ts`, `api/forge/*`). Not implemented in this garden.

## 中文

### 用户现在看到的 sheet

```
🏢 A real building on this tower                                   ✕
[96×96 塔的剪影 / 当前建筑缩略图]
Choose a photo of a building        [No file chosen]
One clear photo of the whole building · forged into 3D in 5–15 minutes
· private until you publish · Pro
```

### 代码现状（生产 chunk `BuildingSheet-DzrXbh4K.js` · `forgeClient-BWDELsVo.js` · `forgeContract-DWXfEnLM.js`）

| 项 | 现状 |
|----|------|
| 选图 | 原生 `<input type="file" accept="image/*">`，无 `capture`，无所选照片预览，无裁切 |
| 客户端处理 | `createImageBitmap` → 长边阶梯 **2048 → 1536 → 1024 → 768** → 白底填充 → JPEG q=0.9 → 必须 ≤ **3 MiB**（否则 `source-too-large`）；EXIF 因重编码不出手机 |
| 上传 | `POST /api/forge/source` `{image: dataURL, requestId}` → `{imageUrl(https 签名), sourcePath, expiresAt}`；超时 35 s |
| 开炉 | `POST /api/forge/start` `{imageUrl, requestId, product:"building", landmarkId}` → 返回 `job` + **providerCredits / dailyCreditsUsed / dailyCreditLimit / globalDailyCreditsUsed / globalDailyCreditLimit**（sheet **未显示**） |
| 推进 | **客户端驱动** `POST /api/forge/advance {jobId}`；退避 3 s×3 → 8 s×5 → 20 s；硬上限 **35 min** → `timed-out` |
| 阶段 | 复用角色锻造合同：`sculpting → rigging → landing → ready / failed / expired`；建筑不送 rig，同 tick 落地 |
| 恢复 | 打开 sheet 时 `GET /api/forge/active?product=building`，若 `subject === landmarkId` 且未终止则继续轮询 |
| 状态 | `idle · uploading · forging · done · signin · tier · busy · failed`（8 个） |
| 错误映射 | `sign-in-required→signin`；`tier-required→tier`；`rate-limited / daily-limit / global-daily-limit / quota-exhausted / request-in-progress→busy`；其余→`failed`（一句 "The forge could not make a building from this photo"） |
| 完成 | `onLanded()` 挂载 GLB → `done` → `PublishNextStep`（进入 ju 窗口发布） |
| 还原 | `hasBuilding` 时显示 **Restore the curated tower** |
| 引擎 | toon 重着色、等比塞进 hU/footU、冠顶重坐；是 dressing，不改 lot |

### 痛点（按用户路径）

1. **门槛后置**：非 Pro / 未登录用户要选完图、上传完才看到 "needs Pro" / "Sign in"。浪费一次 3 MiB 上传与一次 forge/source 配额。
2. **"No file chosen"**：原生控件、无预览、无拍照直达、无拖放；不知道"整栋楼"该怎么拍。
3. **看不见合身**：引擎会等比塞进原塔高度/底盘——宽照片变细塔、横拍变竖条。用户 15 分钟后才发现。
4. **单张照片的 3D**：正面好、背面幻觉；无法选择"镜像正面到四面"或补第二张。
5. **等待体验**：只有 `Forging… 42%`；关闭 sheet 即 abort（`f.current.abort()`），推进靠客户端 `advance`——**用户离开则不落地**，直到回来重开 sheet；provider 3 天后 `expired`。
6. **失败只有一句**：`failed` 吞掉 `body-too-large / job-expired / timed-out / network-error / upstream-failed / source-too-large`；用户不知道是照片问题还是服务问题。
7. **配额不可见**：start 已返回每日额度，sheet 不显示；`busy` 混合了"限流"和"额度用完"。
8. **覆盖无确认**：重锻直接删旧 GLB + 缩略图；若旧建筑正处于**付费公开窗口**，按 S1 规则窗口作废、不退款——sheet 没警告。
9. **政策空白**：皮肤规则是"no logos or signage"，但真楼照片必然带招牌；forge 侧无文字检测；用户未确认版权（"我拍的"）。
10. **可访问性**：进度有 `role=status`，但错误行无 `role=alert`；文件 input 只靠 label 文字。

### 改进方案

**A. 门槛前置（零成本，先做）**
- 打开 sheet 即读 `userStore.tier` + 登录态：非登录 → 只显示 "Sign in to forge a building" + 登录按钮；非 Pro → 显示 "Forging a building needs Pro" + 升级 CTA + **一张示例前后对比图**；file input 禁用。
- `start` 返回的 `dailyCreditsUsed / dailyCreditLimit` 在 sheet 页脚常驻："今日 1 / 3 次"；为 0 时把 `busy` 拆成 `daily-limit`（"明天再来"）与 `rate-limited`（"稍等 1 分钟"）。

**B. 选图 → 预览 → 合身预览（核心）**
- 替换原生控件：一个大按钮 **📷 Take a photo**（`capture="environment"`）+ **🖼 Choose from library**；桌面支持拖放。
- 选中后立刻显示 **所选照片缩略图**（当前只显示旧建筑/剪影）。
- **合身预览**：把照片按引擎同样的 uniform-fit 规则叠到已有的 96×96 塔剪影 SVG 上（`o.boxes` 已在 sheet 里），再给一行 "Your photo will stand **346 m** tall, **50 m** wide — same as The Center"。宽照片会看到自己被留白的样子。
- **裁切**：一个竖向裁切框，默认比例 = 塔的 `heightM : footprintM`（The Center ≈ 6.9 : 1；Jardine House ≈ 4.1 : 1）；可关。裁切在客户端 2048 阶梯之前完成。
- **拍摄指引**（首次 3 行）：整栋入镜、留天空、正面或 45°、避开人和车；配一张 ✅/❌ 缩略示意。
- 保留白底填充与 JPEG 重编码（EXIF 剥离）——在 UI 明说 "Location data never leaves your phone"。

**C. 等待与离开**
- **服务端推进**：为 `product='building'` 加定时 tick（`forge-tick.ts` 已有 tick 基础），不依赖客户端 `advance`；客户端只读状态。这样关掉 sheet / 关掉页面也能落地。
- 完成通知：落地时写 `planet_creations` 并触发 in-app toast（回到星球时）+ 可选 email/push "Your building is up on The Center"。
- 进度文案按阶段：`Uploading… → Queued (#n) → Sculpting ~5 min → Landing → Up`；显示 `startedAt` 和 "usually 5–15 min"；超过 20 min 显示 "taking longer than usual — we'll keep going"。
- 把 `sculpting / rigging` 的角色向文案（"Teaching her to walk…"）与建筑产品隔离——建筑走自己的 `stageCopy`。

**D. 结果与合身修正（落地后）**
- 落地后 sheet 显示三个微调：**Height fit**（Fit height / Fit footprint 切换）、**Rotate 90°**（四个朝向）、**Ground offset**（±2 m）。全是 transform，不重锻。
- **Mirror front**：单张照片的背面可选"镜像正面"替代幻觉面（引擎侧：对 GLB 做 UV/法线镜像或以正面纹理重贴四面）。
- 可选 **second photo**（45° 角）在 forge 支持多视角时启用；UI 先留位。

**E. 失败可诊断**
- 用 `ForgeError.code` 分支文案：
  - `source-too-large` → "Photo too large even after shrinking — try a tighter crop"
  - `body-too-large` → 同上
  - `job-failed` + provider message → "The forge couldn't see a whole building. Try: whole tower in frame, daytime, less sky glare"
  - `job-expired` → "This forge expired (3 days). Forge again — no charge"（若已扣额度需退）
  - `timed-out` → "Still working — come back later, it will finish on its own"（配合 C）
  - `network-error` → "You went offline; the forge is still running"
  - `upstream-failed / proxy-*` → "Our side, not your photo. Try again in a bit"
- 每条错误行 `role="alert"`；保留一个 **Retry** 按钮复用同一 `requestId`（后端已幂等 `idempotentReplay`）。

**F. 覆盖与窗口保护**
- `hasBuilding && creation.window.active` 时，选图前弹确认："This replaces your current building. Its public window (until {when}) is forfeited — no refund." 两个按钮：Replace / Keep.
- 还原（Restore）同样确认，若有活动窗口。

**G. 政策与安全**
- 选图后一行勾选（首次必选，之后记住）："I took this photo / have the right to use it."
- forge 侧加 **文字/标志检测**（OCR bbox）；命中则在 landing 前模糊招牌区域，或标记 `needs-review` 给 admin 队列（队列已有缩略图 + GLB 链接）。
- 人脸/车牌检测 → 模糊（照片本来就该是楼，命中率低但零容忍）。
- 明确 "Real building" 只在**策展地标**上；普通 OSM 楼不显示按钮（现状如此，写进文案避免误解）。

**H. 直传 glTF/GLB（Pro+）**
- 同一 sheet 第二个入口 **"I have a 3D model"**：接受 `.glb ≤ 8 MiB`，走同一 `planet_creations kind='building'` + 同一 uniform-fit；跳过 forge，不耗额度。
- 校验：单 mesh 或 ≤ 20 节点、≤ 100k 三角、纹理 ≤ 2048²、无动画、无外链。

**I. 可访问性与小项**
- 关闭按钮 aria 已有；错误 `role=alert`；进度 `aria-live=polite` 已有。
- sheet 宽度 `min(360px, 100vw-32px)` 在 320 px 手机上文字换行拥挤——hint 缩到两行，或折叠到 "?"。
- 缩略图 96×96 改为与塔同比例的竖图（例如 64×128）。

### 建议的状态机

```
idle
 ├─(not signed in)──────────► gate:signin
 ├─(not Pro)────────────────► gate:tier
 ├─(daily limit hit)────────► gate:limit
 └─(pick / capture / drop)─► preview ──(crop, fit-preview, rights ✓)──► confirm-replace?
                                                                      └► uploading ─► queued ─► forging(pct, stage) ─► landing ─► done ─► adjust ─► publish?
                                                                                    └────────────── error(code) ─► retry(same requestId)
resume: on open, GET active?product=building → if subject==lm → jump to queued/forging with pct
leave:  sheet close does NOT abort the job (server tick); it only stops polling
```

### 新 i18n keys（建议，9 locales）

`planet.scan.building.take` · `.library` · `.drop` · `.preview.fit` ("Stands {h} m tall, {w} m wide — like {name}") · `.guide.1-3` · `.rights` · `.replace.warn` · `.replace.keep` · `.stage.queued` · `.stage.sculpting` · `.stage.landing` · `.stage.slow` · `.quota` ("{used} / {limit} today") · `.err.tooLarge` · `.err.notBuilding` · `.err.expired` · `.err.timeout` · `.err.offline` · `.err.ours` · `.retry` · `.adjust.height` · `.adjust.rotate` · `.adjust.ground` · `.mirror` · `.glb.pick` · `.glb.hint` · `.notify`

### 优先级

| 波次 | 内容 | 依赖 |
|-----|------|------|
| 1 | A 门槛前置 · B 预览+拍照按钮 · E 错误分支 · F 覆盖确认 · G 版权勾选 | 仅前端 + i18n |
| 2 | C 服务端 tick + 通知 · B 合身预览与裁切 · 配额显示 | forge-tick、planet_creations 事件 |
| 3 | D 落地后微调 + Mirror front · H glTF 直传 · G OCR 模糊 | 引擎 transform 持久化、新校验器 |

### 验收

- 非 Pro 用户打开 sheet：0 次网络上传即看到 Pro 门槛。
- 选一张 3:2 横图：预览显示留白的细塔；用户能裁到竖比后再上传。
- 关闭 sheet 后 10 分钟回来：建筑已落地（不需要重开 sheet 等待）。
- 拿一张猫的照片：错误行说明"看不到整栋楼"，不是通用 failed。
- 有活动付费窗口时重锻：出现作废警告，Keep 可取消。

## English

### What the sheet does today
Native `<input type="file" accept="image/*">` (no capture, no preview, no crop) → client downscale ladder 2048/1536/1024/768 → white fill → JPEG q0.9 ≤ 3 MiB → `POST /api/forge/source` → `POST /api/forge/start {product:"building", landmarkId}` → **client-driven** `POST /api/forge/advance` with backoff 3 s → 8 s → 20 s, 35 min hard cap → `onLanded()` → `PublishNextStep`. Eight states; every non-gate error collapses to one "could not make a building" line. Closing the sheet aborts polling; the job only lands when the user comes back. Start returns daily credit usage the sheet never shows.

### Refinements, in order
1. **Gate first** — sign-in / Pro / daily-limit shown before any upload; quota footer "1 / 3 today".
2. **Pick → preview → fit** — Take photo (`capture`) + Library + drop; show the chosen photo; overlay it on the existing 96×96 tower silhouette with the engine's uniform-fit rule; vertical crop defaulting to the tower's `heightM : footprintM`; three-line shooting guide; say "Location data never leaves your phone".
3. **Leave and come back** — server-side tick for `product='building'` so landing does not depend on the tab; in-app toast / optional email when up; stage copy specific to buildings.
4. **After landing** — Fit height / Fit footprint, Rotate 90°, Ground ±2 m (transforms, no re-forge); Mirror front for single-photo backs; slot for a second 45° photo.
5. **Diagnosable failures** — branch on `ForgeError.code` (`source-too-large`, `job-failed`, `job-expired`, `timed-out`, `network-error`, `upstream-failed`), `role="alert"`, Retry reusing the same `requestId`.
6. **Overwrite guard** — confirm when a paid public window is active; forfeiture stated plainly.
7. **Policy** — rights checkbox; OCR signage blur or `needs-review`; face/plate blur; button stays curated-landmark-only.
8. **glTF/GLB direct lane** (Pro+) — ≤ 8 MiB, same creation row, same fit, no forge credits.
9. **A11y / small** — alert roles, hint folded on 320 px, portrait thumbnail.

Waves: (1) gates + preview + errors + guards, front-end only; (2) server tick + notify + fit preview/crop + quota; (3) post-landing transforms + mirror + GLB lane + OCR.

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
