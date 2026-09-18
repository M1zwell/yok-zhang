# Windows 快捷方式 · PC helpers

双击即可。说明在上一层 [`FILM_ON_PC.md`](../FILM_ON_PC.md)。

| 文件 | 作用 |
| --- | --- |
| `03-make-folders.bat` | 建立 `D:\JubuddyAssetFactory\Video Demo\`（含 `00-masters`），并打开时间码记事本 |
| `01-open-planet-kiosk.bat` | Chrome/Edge kiosk 打开 jubuddy.com/planet |
| `02-open-film-kiosk.bat` | kiosk 打开本机 `/film`（先 `bun run dev`） |
| `long-take-marks.txt` | 超长母带现场时间码模板（含 SHOT 编号） |
| `slice-ffmpeg-template.txt` | 按时间码粗切的 ffmpeg 命令模板 |

`chrome` 不在 PATH 时：把 bat 里的 `start chrome` 改成你的安装路径，例如：

`C:\Program Files\Google\Chrome\Application\chrome.exe`
