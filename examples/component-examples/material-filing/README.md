# 素材墙与网页缩略图归档

本范例取自第 7 段的归档镜头，直接调用案例组合 `MaterialCollection`。文件夹先出现，八张本地卡依次缩小、抬起、落入夹口。网页进入后，上排三张缩略图再收入同一文件夹，最后在旁边显示目录。

## 替换内容

- `localCards` 按原卡片的 ID 传入 React 内容。可用 ID 为 `chart`、`history`、`desk`、`workspace`、`voice`、`neurons`、`script-recording` 和 `editor-recording`。替换内容沿用卡片原来的尺寸、入场和归档时刻。
- `webCards` 按从左到右、从上到下的顺序提供最多六张缩略图。前三项同时用于网页上排和对应的飞行卡。
- `folderLabel` 替换文件夹名称。`folderRows` 替换目录条目及数值，建议保持三行，每行用短标签和短数值。保留默认内容时直接省略对应参数。

```tsx
import {MaterialFilingExample} from './examples/component-examples/material-filing/Example';

const MyScene = () => <MaterialFilingExample
  localCards={{chart: <MyChart />}}
  webCards={[<FirstThumbnail />, <SecondThumbnail />, <ThirdThumbnail />]}
  folderLabel="项目素材"
  folderRows={[[ '截图', '12' ], [ '录屏', '3' ], [ '参考图', '6' ]]}
/>;
```

素材采用 800×450 设计坐标。替换图像可用容器宽高的 100% 并设置 `objectFit: 'cover'`。本地卡和网页卡都保留原案例尺寸，新布局或时间编排需重新验收。

## 保留节奏

本例输出 1280×720、30 FPS、180 帧。文件夹在约 0.33 秒开始显现，本地卡在 0.90–2.43 秒依次归档。网页在 2.40 秒开始显现，上排三张从 3.30 秒起错峰飞入文件夹。目录从 4.20 秒后逐行显现，停留到末尾。文件夹的标签页和前板位于卡片上方，卡片到达遮挡处后消失。素材墙的镜头回退与夹口位置仍按原案例计算。

## 单独使用动作

`FileIntoContainer` 接收 `progress`（0 到 1）、`from`（内容的左上角 `x/y` 和原始宽度 `width`）、`to`（藏在容器内的落点，`x` 对应素材中心、`y` 对应素材顶部）。`liftHeight` 是折返点相对落点的高度，默认 128 个设计像素。素材在进度 0.57 处到达落点上方，然后竖直落下，进度到 1 时移除。多张卡各自传进度；容器前板放在飞行内容上层以实现遮挡。

[独立动作源码](../../../packages/animations/src/reference-opening/FileIntoContainer.tsx) · [范例入口](./index.tsx) · [替换内容](./Example.tsx) · [原案例组合](../../reference-opening/compositions/MaterialCollection.tsx)。

生成预览用 `node examples/component-examples/material-filing/render.mjs`。单独打开 Studio 时，入口使用本目录的 `index.tsx`，`--public-dir` 指向 `examples/reference-opening/public`。新范例待用户视觉确认。
