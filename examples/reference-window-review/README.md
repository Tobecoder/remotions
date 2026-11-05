# 截图窗口聚焦 · 待验收

原片定位：02:02–02:15，见 `docs/reference-effects/README.md`。

```sh
npx remotion studio examples/reference-window-review/index.tsx --no-open --port=3004 --public-dir=apps/catalog/public
node examples/reference-window-review/verify.mjs
```

目录站的版式转场分类可直接播放本候选效果，更换“讲解文档 / 代码截图”，拖动进度或重新播放。正式动画清单保持 0，公共入口没有导出该候选组件；视觉确认后才开放正式调用。

动作由帧和 FPS 计算，结束后保持画面；不倒放、不在卡片中强制循环。两张示例 SVG 是原创演示文档，未导入原片图片、角色或音轨。此验证只导出关键帧，不导出 MP4。
