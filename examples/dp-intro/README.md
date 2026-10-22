# 动态规划入门：从最后一步想起

一个可编辑的中文口播教程样片。1920×1080、30 FPS，实际时长 193.73 秒（5812 帧）。从四级楼梯讲解状态、递推、初始条件和自底向上计算；结尾保留五级楼梯练习，不直接揭晓答案。

## 播放

在仓库根目录运行：

```sh
npm ci
npm run preview:dp
```

- 完整教程：http://localhost:3001/DP-Intro
- 代表片段「只看最后一步」：http://localhost:3001/DP-S03 （28.7 秒）
- `DP-S01` 到 `DP-S08` 可分别播放、暂停、跳转和编辑。首次有声播放请点击 Studio 的播放按钮，激活浏览器音频。

已经附带实际 WAV、70 条字幕及字词起始时间，播放不需要安装语音服务或重新合成。当前交付为 Studio 试听预览，未导出 MP4。

## 文件

| 路径 | 内容 |
| --- | --- |
| `src/scenes/S01.tsx`～`S08.tsx` | 八个独立镜头；台阶、路径、表格和代码均为代码绘制 |
| `src/Lesson.tsx` | 完整时间线与单镜配音切片 |
| `src/shared.tsx` | 颜色、图形、字幕和实际配音锚点 |
| `script.txt` | 用户批准的口播稿 |
| `public/audio/narration.wav` | 本机 Microsoft Huihui Desktop 合成音，16 kHz、16 位、单声道 |
| `narration.srt`、`timing.json` | 实际音频片段边界和 SAPI 字词事件时间；不是估算的 ASR |
| `assets/lesson-data.json` | 独立核对的五种路径、DP 表和 C++ 代码 |
| `production.json` | 已确认方案和输入审查记录 |

复用本库的 `BasicCaptions` 和 `NumberCounter`，数学推导图形独立实现。全片没有外部图片、视频、背景音乐或付费语音调用。

`plan.md` 保留确认前的方案原件；用户后续已回复「按方案制作，先用本机中文合成音试听」。当前批准状态以 `production.json` 为准，分镜准确时间以 `timing.json` 为准。为保证口播完整，实际时长比最初 2 分半到 3 分钟的估时稍长，没有强制加速。

## 验证

```sh
npm run check
npm run verify:dp
```

`verify:dp` 使用 Remotion 实际渲染关键帧，检查八镜内容、标题边界、音频 SHA-256、字幕顺序，以及结果 2/3/5 在对应语音字词前一帧仍未知、当帧写入。输出在被 Git 忽略的 `.verification/dp-intro/`。需要 Chrome Headless Shell；可设置 `REMOTION_BROWSER_EXECUTABLE` 指向已安装版本。

已完成本地 235 项现有测试、类型检查、构建、17 个关键帧渲染，以及 Studio 播放/暂停/跳转验证。截图与自动检查不能替代用户对讲解节奏和机器音色的试听确认。

## 重新合成（可选）

无需重生成即可预览。重新生产时，`prepare.py` 使用本机已安装的 `handraw-video-producer` 工序检查器，核对批准稿和输入哈希；修改方案或输入后应重新完成真实确认与审查。

在装有中文 Huihui Desktop 音色的 Windows 上运行：

```powershell
python examples/dp-intro/prepare.py --require
powershell.exe -NoProfile -NonInteractive -File examples/dp-intro/synthesize.ps1 -EpisodePath examples/dp-intro
python examples/dp-intro/assemble-voice.py
```

合成不上传文案。修改配音后需要重新验收实际时间与镜头锚点。
