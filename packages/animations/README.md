# @remotions/animations

Remotion 可复用动画组件，当前公开导出 **5 个**。旧组件及归档实现已移除。

| 类别 | 组件 | 用途 |
| --- | --- | --- |
| 版式转场 | `PerspectivePanel` | 任意内容的透视投影与姿态过渡 |
| 叙事动画 | `ExplodedLayers` | 多层内容拆解与引线标注 |
| 版式转场 | `SceneThumbnail` | 完整场景缩为章节缩略卡 |
| 版式转场 | `FanCardDeck` | 图片、文档等卡片的扇形展开 |
| 文字特效 | `ChapterHeading` | 编号、标题和说明的遮罩切换 |

```tsx
import {FanCardDeck} from '@remotions/animations';
import {interpolate, useCurrentFrame} from 'remotion';

const Gallery = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return <FanCardDeck progress={progress} cards={[
    {id:'script',caption:'脚本',content:<div>替换为你的内容</div>},
    {id:'image',caption:'画面',content:<img src="/your-image.png" />},
  ]}/>;
};
```

组件使用 800×450 设计坐标；可通过组件的尺寸、姿态与位置参数调整，并用外层容器等比缩放到目标画布。内容均为 React 插槽，组件本身不内置参考视频截图，也不负责声音播放。动画进度由调用方的帧计算，适用于随机跳帧与视频渲染。

`ChapterHeading` 也可以接收片头内容：`intro={{eyebrow, title, description}}`（`title` 支持 React 内容，例如两行标题及彩色强调），并传入 `introProgress`。同一进度控制片头退场与章节入场，无需另外写两个淡入淡出动画；`progress` 仍用于后续章节之间的切换。不传 `intro` 时保留普通章节切换行为。

构建：`npm run build -w @remotions/animations`。旧代码可从 Git 历史查看。MIT 许可，见 LICENSE。
