# Remotions

Remotion 动画素材库，当前正在重建。原有 42 个公开动画组件、目录演示和归档旧效果已全部移除。目前正式素材为 **0**；原片开头 10 秒复原为独立候选，尚未登记进目录站。

保留浅色中文网站、分类切换、组件包和构建基础。后续仅加入按参考样片制作、通过实际视觉确认的素材。旧代码可从 Git 历史查看。

## 本地运行

需要 Node.js 20+ 和 npm 10+。

```sh
npm ci
npm run dev
```

打开终端显示的地址，默认 http://localhost:3000。当前所有分类均为空。此前“截图窗口聚焦”的参考出处不成立，已撤下；自行设计实验不应当作原片复刻提交验收。

此前的 24 项清单尚未完成逐项动作核实，不能作为已确认的复刻清单。见[核实更正记录](docs/reference-effects/README.md)。

当前可看[开头十秒复原候选](examples/reference-opening/README.md)：Remotion 场景抽离透视面板、图层展开、章节缩略卡、扇形卡组与标题切换五个组件，支持替换内容。运行说明与参考观察见该示例目录。

## 检查

```sh
npm run check
npm pack --dry-run -w @remotions/animations
```

`@remotions/animations` 当前没有动画导出。独立视频示例保留在 `examples/`，不属于素材库；旧教程中对已删除组件的引用已解除。现有视频制作规划保留于 `docs/`，其中旧组件数量及能力记录属于历史状态。

MIT 开源许可，见 LICENSE。
