# 原片开头 20 秒 · Remotion 复原候选

入口 `index.tsx`，1920×1080、30 FPS，无声。保留 `Reference-Opening-10s`（300 帧），新增 `Reference-Opening-20s`（600 帧）。前十秒动作与时间点见 [SHOTPLAN.md](./SHOTPLAN.md)，后续见 [11–20 秒拆解](./CONTINUATION-SHOTPLAN.md)。

```powershell
npx remotion studio examples/reference-opening/index.tsx --public-dir=examples/reference-opening/public --port=3004
node examples/reference-opening/render.mjs
```

只导出视频、跳过关键帧截图：`node examples/reference-opening/render.mjs --video-only`。

导出完整二十秒：`node examples/reference-opening/render.mjs --20s --video-only`；视频为 `.verification/reference-opening/reference-opening-20s.mp4`，独立报告为 `report-20s.json`，不会覆盖十秒视频。

输出 `.verification/reference-opening/reference-opening-10s.mp4` 及关键帧。先生成截图可加 `--stills`，快速四帧检查可再加 `--quick`。

可复用组件位于 `packages/animations/src/reference-opening/`，现已按用户要求加入素材库，包入口公开导出九个组件及类型。目录独立演示与本场景复用同一套实现。

预览服务启动后打开 http://localhost:3004/Reference-Opening-10s 。

连续二十秒预览为 http://localhost:3004/Reference-Opening-20s 。续段新增「信息叠加 → 音效脉冲徽章」「叙事动画 → 章节卡总览」「叙事动画 → 多路径演示」三项素材。目录卡片用原创配图；案例使用观察截图中的 11 张小卡静态贴图（约 25 KB），没有使用整屏视频代替代码动画。

`ExplodedLayers` 的 `layers` 数组配置每层内容、标签、进入时间；`screen` 可传入任意 React 内容。`PerspectivePanel` 的姿态可替换，`SceneThumbnail` 的目标位置与比例可配置，`FanCardDeck` 的图片、文案、角度和间距可替换。动画不依赖进入时间或播放历史，逐帧与随机跳帧一致。

静态贴图取自本次已观察的参考截图，限于显示器内部、文档、卡片图像。运行不需要原视频、截图目录或网络。`prepare-assets.py` 记录贴图提取坐标；无需在使用时执行。

## 验证边界

`render.mjs` 生成包含转场的 18 个截图检查点（含一次倒序跳帧重渲染），检查输出尺寸、非空画面及逐帧确定性；导出后使用 ffprobe 读取全部 300 帧并确认 10 秒。报告保存在 `.verification/reference-opening/report.json`。

截图检查和机械验证分别记录：它们不等于逐像素一致，也不代替你对还原效果的验收。面板内部的上期视频目前用截图序列表示，未获取其完整原视频或原工程；中间图层的内容为可替换的代码绘制示例。

片头两行标题到“制作方法”由 `ChapterHeading` 的 `intro` / `introProgress` 统一处理。按用户指定的字幕节点，“是怎么从脚本到成片的”在 1.9 秒出现时开始切换，2.6 秒完成；保持原来 0.7 秒的切换效果。与后续“制作方法 → Skill 推荐”的 `progress` 分开编排；共同复用同一个标题组件。

分层展开以素材库组件的默认效果为准。案例仅传入 `startAt={2.1}`、图片文案和画面位置，不再单独设置各层时间、旋转进度或透明度模式。底层在 2.5–3.3 秒完成透视，中间层从 3.9 秒起每隔 0.5 秒入场、每层 0.55 秒；这些值由组件的同一套默认时间线产生。顶部截图始终只有一张可见。

背景使用独立的 `BlurredCollage`：纸纹静止、虚化拼贴向左下漂移并在 3–4.25 秒淡出。目录卡片与案例只替换图片内容，使用相同的漂移、模糊与退场参数；见「背景特效 → 虚化拼贴漂移」。
