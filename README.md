# Remotions

Remotion 动画素材库，当前正在重建。原有 42 个公开动画组件、目录演示和归档旧效果已全部移除，目前可用动画素材为 **0**。

保留浅色中文网站、分类切换、组件包和构建基础。后续仅加入按参考样片制作、通过实际视觉确认的素材。旧代码可从 Git 历史查看。

## 本地运行

需要 Node.js 20+ 和 npm 10+。

```sh
npm ci
npm run dev
```

打开终端显示的地址，默认 http://localhost:3000。所有分类目前显示“正在整理中”。

## 检查

```sh
npm run check
npm pack --dry-run -w @remotions/animations
```

`@remotions/animations` 当前没有动画导出。独立视频示例保留在 `examples/`，不属于素材库；旧教程中对已删除组件的引用已解除。现有视频制作规划保留于 `docs/`，其中旧组件数量及能力记录属于历史状态。

MIT 开源许可，见 LICENSE。
