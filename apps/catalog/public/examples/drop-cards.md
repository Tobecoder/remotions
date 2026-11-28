# 三张工具卡错峰落位

本范例取自第 12 段的工具对比镜头，复现片与范例调用同一个案例组合 `NarrationTools`。先展示麦克风、连接线和三个卡槽，随后三张工具卡依次落位，星标计数与底部波形依次完成。

## 替换内容

`DropCardsExample` 接收三张工具卡组成的 `tools`。每张卡可设置 `title`、`color`、`stars`、`notes` 和 `tags`，省略 `tools` 时使用原案例文案。星标终值以千为单位。强调色同时用于卡片、连线和波形。

```tsx
import {DropCardsExample} from './examples/component-examples/drop-cards/Example';

const MyScene = () => <DropCardsExample tools={[
  {title:'工具 A', color:'#429d7b', stars:12.5, notes:'适合快速整理素材', tags:['素材']},
  {title:'工具 B', color:'#7961c7', stars:9.2, notes:'支持文案与画面预览', tags:['预览','编辑']},
  {title:'工具 C', color:'#4b78ba', stars:6.4, notes:'支持自定义导出设置', tags:['导出']},
]}/>;
```

保留每张卡 155×251 的设计尺寸。标题建议一行，说明控制在三行内，标签最多两行。较长文案或新布局需重新验收。

## 保留节奏

输出 1280×720、30 FPS、210 帧。三张卡在本范例第 38、45、51 帧依次出现，左卡向左倾，中卡直落，右卡向右倾。它们短暂越过各自卡槽，再在第 52、59、66 帧归位。星标在各卡落到卡槽附近时开始，归位后还会计数几帧；底部波形从第 140、156、172 帧错峰展开。结尾停在三张卡均已落稳且波形完整的画面。

## 单独使用动作

`DropCard` 使用相对于开始时刻的 `frame`。`frame < 0` 时隐藏，`frame = 0` 时显示第一帧。每张卡的入场时刻由调用方安排。`x/y` 是落稳后的左上角，`width/height` 是版面尺寸。`tilt` 是第一帧附加倾角（度），负值向左、正值向右，落稳后保留 `rotation` 指定的角度。默认下落并回弹用 14 帧，可用 `durationInFrames` 重设时长。

需要精确拟合轨迹时，可提供像素偏移序列 `offsets`。每一项对应原始轨迹的一帧，负值在卡槽上方，正值越过卡槽，建议以 0 结束；帧之间线性插值。默认轨迹从槽上方 151px 开始，越过 11px 后回正。

[独立动作源码](../../../packages/animations/src/reference-opening/DropCard.tsx) · [范例入口](./index.tsx) · [范例参数](./Example.tsx) · [原案例组合](../../reference-opening/compositions/NarrationTools.tsx)。

生成预览用 `node examples/component-examples/drop-cards/render.mjs`。单独打开 Studio 时，入口使用本目录的 `index.tsx`，`--public-dir` 指向 `examples/reference-opening/public`。新范例待用户视觉确认。
