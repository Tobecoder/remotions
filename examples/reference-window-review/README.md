# 截图窗口聚焦 · 未采用的自行设计实验

原先将本实验标为原片 02:02–02:15 的复刻不成立，现撤销该标注。动作和时长是自行设计的，不能据白色文档卡的静帧推断原片有同样运动。见 `docs/reference-effects/README.md`。

```sh
npx remotion studio examples/reference-window-review/index.tsx --no-open --port=3004 --public-dir=apps/catalog/public
node examples/reference-window-review/verify.mjs
```

本实验已从目录站及待验收清单撤下。源码和本地验证入口仅作追溯保留，公共入口没有导出。技术检查只能验证自行设计的实现，不能证明原片还原度。

动作由帧和 FPS 计算，结束后保持画面；不倒放、不在卡片中强制循环。两张示例 SVG 是原创演示文档，未导入原片图片、角色或音轨。此验证只导出关键帧，不导出 MP4。
