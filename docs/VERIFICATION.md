# Remotion 素材库验证记录 — 2026-10-22

- `npm run check`：64 个测试通过（动画包 38 项、目录站 26 项）；根项目语义类型检查、组件库 ESM/CJS 与类型声明、Vite 生产构建通过。
- 示例 WAV 由 `scripts/generate-demo-audio.mjs` 生成，为 48 kHz、单声道、6 秒的原创信号；测试检查文件结构与不同片段的能量变化。
- React 交互测试覆盖分类方向键与 Home/End、鼠标悬浮/点击、触摸点击两次播放/停止、键盘聚焦后停止/恢复预览；测试中的卡片预览句柄使用轻量替身，真实 Remotion Player 的跨浏览器验收仍需手工执行。
- 组件测试以模拟的音频分析结果验证帧变化、SVG 结构、小尺寸柱宽边界和非 WAV 输入透传；浏览器预览使用真实 WAV 与 Remotion 音频解码，MP3/AAC 的实际解码能力仍取决于浏览器和运行环境。
- 生产构建有一个超过 500 kB 的 Vite 体积提示，构建仍成功。组件库尚未发布到 npm；目录站点已部署为私有 Site，地址为 `https://remotions-library.lovepp888.chatgpt.site`。
