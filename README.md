# Remotions

Remotion 动画素材库，当前正在重建。原有 42 个公开动画组件、目录演示和归档旧效果已全部移除。目前正式素材为 **0**，新增 **1 个待验收候选效果：截图窗口聚焦**。

保留浅色中文网站、分类切换、组件包和构建基础。后续仅加入按参考样片制作、通过实际视觉确认的素材。旧代码可从 Git 历史查看。

## 本地运行

需要 Node.js 20+ 和 npm 10+。

```sh
npm ci
npm run dev
```

打开终端显示的地址，默认 http://localhost:3000。版式转场分类提供候选效果的动态预览，可切换文档/代码截图、拖动进度与重播；其他分类仍为空。候选效果未通过视觉确认前不会计入正式库或公共动画导出。

参考片首轮拆解为 24 项，见[效果清单](docs/reference-effects/README.md)。首个候选的关键帧验证：`node examples/reference-window-review/verify.mjs`。

## 检查

```sh
npm run check
npm pack --dry-run -w @remotions/animations
```

`@remotions/animations` 当前没有动画导出。独立视频示例保留在 `examples/`，不属于素材库；旧教程中对已删除组件的引用已解除。现有视频制作规划保留于 `docs/`，其中旧组件数量及能力记录属于历史状态。

MIT 开源许可，见 LICENSE。
