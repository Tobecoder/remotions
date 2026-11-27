# 落篮收集与额度说明

本范例直接调用原案例 `ResourceCredits`，组合独立动作 `TokenBowl` 和 `CardEntrance`。完整效果包括标题、物件落篮堆积、额度卡进入、领取和消耗逐项展示、旧数值划线及变化提示。原片与范例引用同一组合，固定讲解顺序保存在案例中，不作为公开动作导出。

## 替换内容

`ResourceCreditsExample` 接受 `count`（收集数量）、`icon`（React 图标）及 `copy`。`copy` 可局部替换 `eyebrow/title/platform/description/dailyLabel/dailyValue/costLabel/costValue/changedLabel`。示例中的 10 / 2 积分是可替换的示意文案，不代表当前任何平台规则。

```tsx
import {ResourceCreditsExample} from './examples/component-examples/resource-credits/Example';
const MyScene=()=> <ResourceCreditsExample count={20} copy={{
  title:'积累素材，完成小作品', platform:'我的素材库',
  dailyLabel:'本次收集', dailyValue:'12 份',
  costLabel:'本次采用', costValue:'3 份', changedLabel:'旧统计已更新',
}}/>;
```

输出 1280×720、30 FPS、330 帧、11 秒，采用 800×450 设计坐标。左侧标题保持一至两行内的短句，标题建议不超过 12 字；数据值建议不超过 8 字。右卡宽 286、高从 188 随变化提示扩展至 214。卡内标题位于 (24,18)，两行额度中心相隔 52，底部提示位于 (17,173)；卡内元素使用固定槽位和明确行高，避免页面行高影响纵向间距。新布局或长文本需重新验收。

## 保留节奏

标题在第 9–17 帧进入，落篮从第 36 帧显现，第一件物体从第 42 帧开始下落，默认每隔 0.09 秒进入一件、0.55 秒落稳，共 20 件。容器前沿始终在物件前面，落稳的物件不会消失；最后一排在篮口露出。

卡片第 99–109 帧进入，领取行第 159 帧、消耗行第 198 帧出现；第 263–270 帧划掉旧数据，变化提示在第 266–270 帧出现。结尾保持完整结果。原案例在第 308 帧后由外部镜头安排淡出，与下一组素材卡交叉；本范例单独保留结尾阅读时间。

## 单独使用落篮动作

`TokenBowl` 独立接收 `time/startAt/count/interval/fallDuration/x/y/width`；设计坐标 280×250，默认最多 60 件。可替换 `bowlColor/rimColor/tokenColor`，或通过 `token` 传 React 内容替换每个物件（18×27 设计像素）。`time/startAt` 用秒，调用方可平移时钟、暂停或倒序跳帧，不依赖随机数或播放历史。容器形状和内部落点保留，适合小物件收集；新的容器轮廓或大型素材需重新验证遮挡关系。

入口：[index.tsx](./index.tsx)、[替换内容](./Example.tsx)、[元数据](./example.json)、[同源组合](../../reference-opening/compositions/ResourceCredits.tsx)。生成预览：`node examples/component-examples/resource-credits/render.mjs`。视频、海报与说明同步输出到素材站。新范例待用户确认；自动检查不代表视觉验收。
