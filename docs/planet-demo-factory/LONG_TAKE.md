# 一条超长母带，再切片 · One long take, then slice

你可以 **先录一条很长的**，回家再用剪映 / CapCut / DaVinci 切成 `SHOT_LIST.md` 里的短片。  
You can record **one long master**, then cut 8–12s posts at the desk.

对着拍（第二屏或手机）：本页。短条打勾仍用 [`SHOT_LIST.md`](./SHOT_LIST.md)。  
Keep this page on a second screen. The short-take list is still the naming bible.

---

## 建议几条母带 / How many masters

一条 30 分钟也可以，但中途崩了会全没。更稳：

| 母带 | 保存为 | 大约 | 内容 |
| --- | --- | --- | --- |
| 客人走路 | `00-masters/pc_long_guest.mp4` | 12–18 分钟 | 中环 HUD → 深渊 → 东京目录 → 巴黎 → 纽约 |
| 登录后 | `00-masters/pc_long_synced.mp4` | 4–8 分钟 | ☁️ Synced、ju、Print、Re-skin（不付款） |
| 片头（可选） | `00-masters/pc_long_film.mp4` | 20 秒 | `/film` 走两圈。或继续用短条 A1/A2 |

磁盘：1080p60 NVENC 大约每小时 8–20 GB。20 分钟很轻松。  
Disk is cheap. 20 minutes is fine.

---

## 录之前 / Before you hit record

1. https://jubuddy.com/planet 等到 **能 WASD**。  
2. 关掉 Chrome「无法更新」。`F11`。点 **⋯ More controls**。  
3. 第二屏打开本页。旁边一个记事本（模板 `pc/long-take-marks.txt`），每切一个动作记一行 `分:秒`。  
4. OBS：1920×1080、**60fps**、窗口采集、裁标签栏、**关声**、NVENC。热键：开始 / 暂停 / 停止。  
5. OBS 若有 **标记 / marker** 热键，每个动作打一个。没有就靠记事本。

**录制中：** 点完按钮后 **停住玩 8–12 秒**（走、转、看 HUD）。切片要的是这段，不是点击瞬间。  
After each click, **play for 8–12s**. That linger is the slice.

加载、转圈、菜单飞进来：用 OBS **暂停**，好了再继续。同一文件。  
Pause OBS during spinners. Same file.

不要确认 **Ask to be located**。Rally 没路就跳过，不要盯着 toast 录。  
Never confirm locate. Skip a dead Rally toast.

---

## 客人母带跑法 / Guest run-of-show

打开 https://jubuddy.com/planet 。**不要为了换城去改地址栏**（会露出 Chrome）。用游戏内 **Choose a planet / All HK / Drop me**。实在要贴 URL：先暂停 OBS。

每个节拍：**点 → 玩 8–12 秒 → 记时间码 → 下一拍。**  
Click → play 8–12s → jot timecode → next.

切片时用「SHOT」列对 [`SHOT_LIST.md`](./SHOT_LIST.md) 改名。  
Rename slices with the SHOT id.

| 节拍 | SHOT | 点什么 | 切片后文件名 |
| --- | --- | --- | --- |
| 1 | B2 | **Immersive**，WASD + Shift | `01-modes/pc_immersive_walk.mp4` |
| 2 | B1 | **Overview**，看行星转 | `01-modes/pc_overview_central.mp4` |
| 3 | B9 | **Alt+Shift** 拖转 | `02-hud-tools/pc_altshift_orbit.mp4` |
| 4 | B3 | ☀️→🌙 **Night** | `02-hud-tools/pc_weather_night.mp4` |
| 5 | B4 | 🌧️ 或 🌀 一条 | `02-hud-tools/pc_weather_rain_or_typhoon.mp4` |
| 6 | B8 | **Stargaze** | `02-hud-tools/pc_stargaze.mp4` |
| 7 | B5 | 📌 钉 IFC / 停一栋楼，看到温度 AQI 车位。另截 `still_live_pin.png` | `02-hud-tools/pc_live_pin_ifc.mp4` |
| 8 | B6 | **Interior (I)**，扫一眼 Shop / 3D / Print | `02-hud-tools/pc_interior_grey_hour.mp4` |
| 9 | B7 | **Photo** 或 **Pet** 或 **Ride (M)** 只留一个 | `02-hud-tools/pc_photo_pet_or_tram.mp4` |
| 10 | C1 | **Kart**（有 Gas/Brake 才留） | `01-modes/pc_kart.mp4` |
| 11 | C2 | **Siege** → Defend，Wave 1 在打 | `01-modes/pc_siege_wave1.mp4` |
| 12 | C3 | **Sea Circus** 或 **Set sail**；废了就跳 | `01-modes/pc_sea_or_sail.mp4` |
| 13 | E3 | **Hero** 或 **My Bastion** | `03-hero-pet/pc_bastion_hero.mp4` |
| 14 | E1 | **Depths** 名单 | `03-hero-pet/pc_depths_picker.mp4` |
| 15 | E2 | **Jubit 3D** 进地牢，走 10–15s，`I` 出来 | `04-depths-build/pc_depths_inside.mp4` |
| 16 | D1 | **Choose a planet** 东京区目录 | `01-modes/pc_choose_planet_tokyo.mp4` |
| 17 | D3 | **Drop me** 或点进巴黎 | `01-modes/pc_drop_me.mp4` |
| 18 | D2 | 巴黎 Overview（塞纳河岛）。可 Ride moped | `01-modes/pc_paris_ile_de_la_cite.mp4` |
| 19 | C5 | 纽约 **Play** Courier 名单 | `01-modes/pc_nyc_courier.mp4` |
| 20 | C4 | 纽约 **Rally** 仅当能开；否则静帧 | `01-modes/pc_nyc_rally.mp4` |

节拍 16–20 若目录打不开：暂停，地址栏贴 https://jubuddy.com/paris 或 `/nyc`，全屏后再录。  
If the in-app catalog sticks, pause, paste the city URL, fullscreen, resume.

---

## 登录母带 / Synced run-of-show

另开一条。先 https://jubit.ai/signin 过 2FA，planet 上看到 **☁️ Synced** 再按录。

| 节拍 | SHOT | 点什么 | 切片后文件名 |
| --- | --- | --- | --- |
| S1 | F1 | 顶上 **☁️ Synced** | `05-flows/pc_synced.mp4` |
| S2 | F2 | **Refill ju** $5/$10/$25。**不付款** | `05-flows/pc_refill_ju.mp4` |
| S3 | F5 | Interior → **Print** 四档 | `05-flows/pc_print_desk_6.mp4` |
| S4 | F3 | **Re-skin** 面板，不传文件 | `04-depths-build/pc_reskin_sheet.mp4` |
| S5 | F4 | **Build** 面板，不花 ju | `04-depths-build/pc_build_sheet.mp4` |

---

## 现场时间码 / Marks while you film

复制 `pc/long-take-marks.txt` 到 `D:\JubuddyAssetFactory\Video Demo\00-masters\`，边拍边填。OBS 时间码和记事本同一套数字。

```
母带文件 / master file:  pc_long_guest.mp4
mm:ss   节拍  SHOT
00:00   开始录 record start
00:     1   B2   immersive
00:     2   B1   overview
...
```

---

## 回家切片 / Slice at the desk

工具：剪映 / CapCut / DaVinci 都可以。不要把加载、弹窗、停住发呆切进短片。  
Do not keep loaders, dialogs, or dead stares in a slice.

### 剪映 / CapCut

1. 导入 `00-masters/pc_long_guest.mp4`。比例 **16:9**。  
2. 对照 `long-take-marks.txt`：播放头跳到该 `mm:ss`，再往后找 **星球已在动、HUD 已在** 的 8–12 秒。  
3. 分割（快捷键常是 `Ctrl+\` 或刀片）。头尾各丢掉点击瞬间。  
4. 把那段拖进新时间线（或单独导出片段）。**一条时间线一个动词。**  
5. 导出：1920×1080、30 或 60fps、**无声**、H.264。  
6. 文件名改成上表「切片后文件名」，丢进对应 `01`–`05` 文件夹。  
7. 发片仍按 SHOT_LIST 底部优先级：B1 Overview → B3 Night → B5 Pin → D2 Paris → E2 Depths inside。

一条短视频还是 **一个动词**。超长母带只给自己剪，**不要直接发 15 分钟**。  
Do not post the 15-minute master. Post the slices.

### ffmpeg 粗切（可选）

按时间码先切块，再进剪映修头尾。把 `00:01:12` 换成记事本上的数：

```
ffmpeg -ss 00:01:12 -i pc_long_guest.mp4 -t 10 -c:v libx264 -an -crf 18 pc_overview_central.mp4
```

一整批命令模板：`pc/slice-ffmpeg-template.txt`（先填 marks，再取消注释）。

---

## 还给我 / When you come back

把整个 `Video Demo` 丢回对话，并写：

```
母带：pc_long_guest.mp4 （约 xx 分钟）
marks：有 / 没有（文件在 00-masters\）
已切片：B1 B3 … / 还没切，请你按 marks 切
```

未切片也可以。有母带 + 时间码我就能帮你对 `SHOT_LIST` 下刀。  
A master + marks is enough. I can slice to the shot list when you return.
