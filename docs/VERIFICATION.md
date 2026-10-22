# Remotion 素材库验证记录 — 2026-10-22

## Storytelling 接入验证

- 分支 `feat/remotions-storytelling` 从已推送的 Effects 分支 `6ce7cdb` 创建，保留尚未合并的 Effects / Overlays；没有将本轮改动写入 main。
- 参考 [新闻高亮](https://www.remotion.dev/elements/text/news-article-highlight/)、[速度线](https://www.remotion.dev/elements/storytelling/speed-lines/)、[屏幕消息](https://www.remotion.dev/elements/storytelling/on-screen-messages/)、[拍立得照片](https://www.remotion.dev/elements/storytelling/polaroid-pictures/) 的公开演示和源码，新增四个组件及独立中文分类。新闻标记使用本库 SVG 实现；保留衬线排版、手绘笔触、错峰时序、蓝灰消息尾巴、胶带纸影与多方向照片入场。
- 14 项新增组件测试覆盖逐帧可见性、受控进度、24/30/60 FPS、速度、完整退出/可选保留、消息顺序、确定性速度线与中心留空、空数组、长文本、多照片及非法参数。单元测试替换图片加载端；真实 Img 在下面的浏览器检查中执行。
- 目录测试新增四项示例代码检查和八项时间线检查，消息采用正向播放后保持，其他三项展示完整进出场；静止时取内部可见帧。
- `npm run verify:storytelling` 使用构建后的 CJS 入口、真实 Remotion 浏览器和本地图片/字体生成 16 张 PNG：640×260 下四项的首/中/末帧，以及 360×640 下各项的中间帧。检查图像尺寸、有效内容和预期退出状态，全部通过。关键帧已人工查看；照片为旋转、漂移、胶带与阴影留出空间，竖屏采用等比居中的横向参考舞台。
- 本地真实目录检查了四张卡片、叙事分类、照片悬浮时依次进入与本地图片加载。此轮没有导出新的 MP4，也没有重新部署站点；远端 CI 状态以对应 PR 为准。

- `npm run check`：192 个测试通过（动画包 114 项、目录站 78 项），另通过独立 CJS 运行检查；根项目语义类型检查、组件库 ESM/CJS 与类型声明、Vite 生产构建通过。`npm pack --dry-run -w @remotions/animations` 通过。
- 示例 WAV 由 `scripts/generate-demo-audio.mjs` 生成，为 48 kHz、单声道、6 秒的原创信号；测试检查文件结构与不同片段的能量变化。
- React 交互测试覆盖分类方向键与 Home/End、鼠标悬浮/点击、触摸点击两次播放/停止、键盘聚焦后停止/恢复预览；测试中的卡片预览句柄使用轻量替身，真实 Remotion Player 的跨浏览器验收仍需手工执行。
- Layouts 覆盖画中画转场、滑动分屏、本库旋转卡片和产品卡组 ProductCollection，测试验证帧驱动变化、受控进度、画中画裁剪圆角、目录预览末帧可见以及非法尺寸回退；目录预览对这四个版式使用单向播放并停在末帧，避免倒放或直接重置造成误导。
- Charts 覆盖横向条形图、趋势折线图、数字计数器、占比饼图和纵向条形图，测试验证逐帧变化、受控进度、自定义标签、显式空数组空状态、负值和长数据保真、默认多色、密集数据的交错时序、各类图表标签采样与画布边界、饼图全零/全负状态、单项 100% 饼图、小数权重占比、稀疏有效扇区标签、零权重扇区路径省略、折线图渐变 ID 唯一性、非法尺寸回退与计数终值。
- 组件测试以模拟的音频分析结果验证帧变化、SVG 结构、小尺寸柱宽边界和非 WAV 输入透传；浏览器预览使用真实 WAV 与 Remotion 音频解码，MP3/AAC 的实际解码能力仍取决于浏览器和运行环境。
- 生产构建有一个超过 500 kB 的 Vite 体积提示，构建仍成功。组件库尚未发布到 npm；目录站点已部署为私有 Site，地址为 `https://remotions-library.lovepp888.chatgpt.site`。
- Overlays 覆盖地点叠加和姓名叠加。测试验证定位针先描绘再填色、单行地点遮罩、双色信息条交错进入和退出、24/30/60 FPS 时序、可控进度、自定义文案、非法尺寸回退，以及目录静止帧与完整循环配置。
- 本地浏览器对照了 Remotion Elements 的 Overlays：定位针与地点文字、蓝黑双条姓名卡；未进行手机实机或 MP4 输出验收。
- Effects 新增摇摆气泡、纸面揭开、斜向扫光、纸面撕裂。后三者使用官方效果工厂和 CanvasImage；测试验证实际描述符、卷曲前中后位置、纸背参数、分辨率缩放、24/30/60 FPS 与速度控制、非法参数回退和示例代码。
- Remotion 相关运行依赖已统一到 4.0.537，新增 @remotion/effects peer 依赖。`npm run test:effects:cjs` 在独立 Node 进程挂载构建后的 Peel、Shine、TearApart，实际动态加载原生 ESM 工厂并检查描述符和句柄释放；此项替换 CanvasImage 绘制端，不作为像素验收。
- 新增 7 项异步加载回归测试：首次渲染同步阻塞、效果内容提交后释放、缓存命中、加载失败、快速卸载、渲染上下文更换，以及 Strict Mode 加载完成/未完成两种清理情况。每个延迟句柄只释放一次。
- 本地浏览器已对照源站确认折面与纸背、扫光、锯齿裂缝和旋转方向。卷曲使用 WebGPU；不需要 HTML-in-canvas 实验开关。

## Effects 视频导出验收

运行 `npm run verify:effects:render` 会从构建后的 CJS 入口生成三个 640×360、30 FPS 的 H.264 视频，使用脚本内置 SVG 图像，不依赖远程素材。输出在 Git 忽略的 `.verification/content-effects/`：

| 效果 | 时长 | 检查帧 | 结果 |
| --- | --- | --- | --- |
| Peel | 2 秒 | 0 / 30 / 59 | 首帧完整、中间卷曲与纸背正常、末帧按设计退出 |
| Shine | 1.5 秒 | 0 / 22 / 44 | 首末帧保留图像、中间斜向光带正常 |
| TearApart | 1.5 秒 | 0 / 22 / 44 | 首帧完整、中间和末帧裂缝与旋转正常 |

脚本同时导出独立 PNG，并从实际 MP4 解码上述关键帧，验证分辨率、时长、首帧有效像素、中间内容和预期末帧状态；本次全部通过，9 张关键帧也已人工查看。`report.json` 保留元数据和 MP4 关键帧的有效颜色像素数。此验收覆盖默认速度与横屏尺寸；移动设备、其他显卡和更多尺寸尚未验证。

可通过 `REMOTION_BROWSER_EXECUTABLE` 指定支持 WebGPU 的 Chromium，`REMOTION_VERIFICATION_PORT` 指定本地端口（默认 3347）。本机最初使用的 Headless Shell 缺少 DXIL 运行库，完整 Chromium 启动又返回 `spawn UNKNOWN`；最终使用同版本 Headless Shell 及其匹配的 DXIL/DXCompiler 库在 `.verification/browser/` 完成导出。本机浏览器文件与输出视频不提交到仓库。MP4 验收为本地执行，尚未代表远端 Node 22/24 CI 已运行。
