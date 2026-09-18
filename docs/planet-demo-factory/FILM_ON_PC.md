# 在强机上拍 · Film on your PC

云端 Linux 录出来的片子会卡、会糊、会空等。**不要用那些成片当成品。**  
Cloud Linux recordings stutter. **Do not post them as the look.**

你回家用自己的电脑 + Chrome（或 Edge）拍。拍完把文件夹丢回来即可。  
This page is the human playbook. Powerful PC + browser. Drop the folder back when you are done.

**对着拍的清单：** [`SHOT_LIST.md`](./SHOT_LIST.md)（一条一条短拍）  
**一条超长再切片：** [`LONG_TAKE.md`](./LONG_TAKE.md)  
**文案 / 能不能说 LIVE：** [`SOCIAL_AND_CLAIM.md`](./SOCIAL_AND_CLAIM.md)  
**存盘目录：** `D:\JubuddyAssetFactory\Video Demo\`

---

## 1. 五分钟摆桌 / Desk in five minutes

1. 建目录（或双击 `pc/03-make-folders.bat`）：

```
D:\JubuddyAssetFactory\Video Demo\
  00-masters\          超长母带 + long-take-marks.txt
  01-modes\
  02-hud-tools\
  03-hero-pet\
  04-depths-build\
  05-flows\
  06-highlights\
```

2. 装 **OBS Studio**（推荐）。备选：Win+G Xbox 游戏栏。  
   Install **OBS Studio** (best). Fallback: Xbox Game Bar (`Win+G`).

3. Chrome 或 Edge。任务栏设为自动隐藏。书签栏关掉（`Ctrl+Shift+B`）。  
   Auto-hide the taskbar. Hide the bookmarks bar.

4. 打开 planet，**先等能走**，再录。加载不要进成片。  
   Open the planet, **wait until you can walk**, then record. Do not keep the spinner.

```
https://jubuddy.com/planet
```

全屏：`F11`。退出 kiosk：`Alt+F4` 或再按 `F11`。  
Fullscreen: `F11`. Leave kiosk with `Alt+F4` or `F11` again.

快速 kiosk：双击 `pc/01-open-planet-kiosk.bat`。

---

## 2. OBS 怎么设 / OBS settings

| 项 | 设 |
| --- | --- |
| 画布 | 1920×1080 |
| 帧率 | **60**（机子吃力就 30） |
| 采集 | 窗口采集 → Chrome。不要采集整个桌面 |
| 裁切 | 裁掉标签栏 / 标题栏。成品里不要出现地址栏 |
| 热键 | 开始/停止录制设成你记得住的键 |
| 保存到 | `D:\JubuddyAssetFactory\Video Demo\` 对应子文件夹 |
| 编码器 | NVENC / AMF（独显）。不要软编把星球拖卡 |
| 音频 | 关。成片无声即可 |

两种拍法（可混用）：

- **短条：** 一条片子 **8–12 秒**。一个动作。先切好模式，**星球已经在动**，再按录制。清单：[`SHOT_LIST.md`](./SHOT_LIST.md)。  
- **超长母带：** OBS 一口气录 12–18 分钟，每个按钮后停住玩 8–12 秒，记时间码。回家再切。跑法：[`LONG_TAKE.md`](./LONG_TAKE.md)。母带进 `00-masters\`，**不要直接发 15 分钟**。

Short takes or one long master you slice later. Mix them if you want.

游戏栏备选：`Win+Alt+R` 开始/停。文件会进 `Videos\Captures`，再挪到 D:。  
Game Bar fallback: `Win+Alt+R`. Move files out of `Videos\Captures` into D:.

---

## 3. 绝对不要 / Never

- 不要点 **Ask to be located** 的确认。跳过。Never confirm locate.
- 不要完成 Stripe / 不要花 ju / 不要上传 Re-skin 文件。Show the sheet only.
- 不要把 **$8.88 Pro** 写成 planet。那是 ChatLab。
- 不要发中环 Rally 的 **“no connected drivable route”**。有油门刹车再拍；没有就静帧。
- 不要写 “world’s first”。说「可玩的城市行星 + 活数据」。
- 不要把云端那批 25fps 长片当 Hero。

---

## 4. 两个画面 / Two surfaces

| 画面 | 地址 | 拍什么 |
| --- | --- | --- |
| Remotion 9 秒循环 | 本仓库 `bun run dev` → http://localhost:3100/film | 抽象星球片头。简体：`/zh-Hans/film` |
| 真 planet | https://jubuddy.com/planet | 能走的中环 / 巴黎 / 纽约 / 深渊 |

Planet **不在**这个花园仓库里。本机 `/film` 只是片头。真走路去 jubuddy.com。  
Planet source is not in this garden. `/film` is the 9s title loop. Walk the live SPA.

本机片头：

```
cd <this-repo>
bun run dev
```

浏览器开 http://localhost:3100/film → `F11` → 等字幕出来 → 录 **10 秒**（循环是 9 秒）。  
简体小红书：http://localhost:3100/zh-Hans/film

只想拍真 planet、不跑仓库：跳过 `/film`。  
Skip `/film` if you only want live planet.

---

## 5. HUD 在哪 / Where the buttons are

先点右上 **⋯ More controls**，天气和第二排才会齐。  
Click **⋯ More controls** if weather / second row is missing.

**顶排：** Play · Rally · Kart · Sea Circus · Set sail · Siege · Immersive · Overview · All HK · Language · 城市 · ☀️🌅🌙🌧️🌀🫧 · Stargaze

**第二排：** Ask to be located *(不要确认)* · Play stats · Sign in to sync · 📌 · My Bastion · Hero · Depths · Brief · Views · Drop me · Home

**右侧：** Photo · Shop · Pedestrian (P) · Interior (I) · 附近建筑 (G) · Pet · Ride (M)

**键盘（画面上有提示）：** WASD 走 · Shift 跑 · Space 跳 · F 摆荡 · B 桥 · M 骑 · O 总览 · P 行人 · I 室内 · G 进楼

**Depths 里：** Clear the garrison · Level 1/3 · 守关后 E 下 Boss · I 离开

切城（省得翻目录）：

- 中环 https://jubuddy.com/planet
- 纽约 https://jubuddy.com/nyc
- 巴黎 https://jubuddy.com/paris
- 登录 UI https://jubit.ai/signin （`jubuddy.com/signup` 是 404）

---

## 6. 怎么拍才顺 / Pacing

**短条：** 打开 URL → 等到能走 → 点好模式 → **现在**才录 → 8–12 秒就停。不要一条短片里切十个按钮。

**超长：** 能走之后再按录。每个动作后玩 8–12 秒再点下一个。加载就 **暂停** OBS。时间码记在 `00-masters\long-take-marks.txt`。细节：[`LONG_TAKE.md`](./LONG_TAKE.md)。

Chrome「无法更新」弹窗：先点 X，再录。  
Dismiss “Can’t update Chrome” before the take.

Rally：等第一人称出现 Gas/Brake 再录 8 秒。若只有 “Building a route…” 或 “no route” —— **停，别当完成片。** 能走就抓一张静帧。

---

## 7. 钱怎么上镜 / Money (honest)

拍得到、可以说：Print 地球仪 **Desk 80mm $6 · Shelf $8 · A1 mini $10 · Studio $14**。「你付钱，没有 3D 文件，不是游戏课金赢。」

登录后（你的电脑能过 Google 2FA）再拍，**不要付款：**

- Refill ju：Starter **$5 / 500** · Standard **$10 / 1100** · Creator **$25 / 3000**
- 画面出现 **☁️ Synced** 再拍 ju / Re-skin / Build
- Build / Re-skin：打开面板即可，不花 ju、不传文件

---

## 8. 拍完怎么还给我 / When you come back

1. 文件已经在 `D:\JubuddyAssetFactory\Video Demo\`。短条按 `SHOT_LIST.md` 命名；超长放 `00-masters\` 并带 `long-take-marks.txt`。  
2. 把整个 `Video Demo` 文件夹（或 zip）丢回这次对话。  
3. 用三行笔记即可，例如：

```
拍了：A1 A2 B1 B3 B5 D2 E2
没拍：C4 Rally 没路；F2 没 Synced
母带：pc_long_guest.mp4 + marks / 没有母带
Rally 静帧：有 / 没有
```

不必自己剪 1.45×。你在 1080p 60fps 全屏拍的就是成品。  
Do not speed-ramp if the take is already 1080p kiosk. Cloud recuts were a bandage.

可选：若仍带浏览器栏，再用 `scripts/smooth-cut.sh`（需要 ffmpeg）。强机全屏拍则跳过。

---

## 9. 云端那批怎么用 / Cloud library (reference only)

云端 `01`–`05` 母带和 `smooth_*` 只证明「功能存在」，**不能当质感。** 你的 PC 片替换它们。

可参考、不要发：长 25fps、带标签栏、空等 3–8 秒的文件。  
Still useful as a map of which button is which. Not the public look.
