# 原片开头 10 秒 · Remotion 复原候选

入口 `index.tsx`，1920×1080、30 FPS、300 帧，无声。参考动作与时间点见 [SHOTPLAN.md](./SHOTPLAN.md)。

```powershell
npx remotion studio examples/reference-opening/index.tsx --public-dir=examples/reference-opening/public --port=3004
node examples/reference-opening/render.mjs
```

只导出视频、跳过关键帧截图：`node examples/reference-opening/render.mjs --video-only`。

输出 `.verification/reference-opening/reference-opening-10s.mp4` 及关键帧。先生成截图可加 `--stills`，快速四帧检查可再加 `--quick`。

可复用组件位于 `packages/animations/src/reference-opening/`，现已按用户要求加入素材库，包入口公开导出五个组件及类型。目录独立演示与本场景复用同一套实现。

预览服务启动后打开 http://localhost:3004/Reference-Opening-10s 。

`ExplodedLayers` 的 `layers` 数组配置每层内容、标签、进入时间；`screen` 可传入任意 React 内容。`PerspectivePanel` 的姿态可替换，`SceneThumbnail` 的目标位置与比例可配置，`FanCardDeck` 的图片、文案、角度和间距可替换。动画不依赖进入时间或播放历史，逐帧与随机跳帧一致。

静态贴图取自本次已观察的参考截图，限于显示器内部、文档、卡片图像。运行不需要原视频、截图目录或网络。`prepare-assets.py` 记录贴图提取坐标；无需在使用时执行。

## 验证边界

`render.mjs` 生成包含转场的 18 个截图检查点（含一次倒序跳帧重渲染），检查输出尺寸、非空画面及逐帧确定性；导出后使用 ffprobe 读取全部 300 帧并确认 10 秒。报告保存在 `.verification/reference-opening/report.json`。

截图检查和机械验证分别记录：它们不等于逐像素一致，也不代替你对还原效果的验收。面板内部的上期视频目前用截图序列表示，未获取其完整原视频或原工程；中间图层的内容为可替换的代码绘制示例。

片头两行标题到“制作方法”现由 `ChapterHeading` 的 `intro` / `introProgress` 统一处理，时间为 5.65–6.35 秒。与后续“制作方法 → Skill 推荐”的 `progress` 分开编排；共同复用同一个标题组件。

案例里的中间纸片设置 `ExplodedLayers opaquePaper`，避免文字和波形从半透明纸片下方透出。移动方向、轨迹及各层原有的开始时间和 0.55 秒入场时长保持；顶部截图按时间点直接切换，始终只有一张可见。
