# 毛绒小熊角色 · 2026-11-06

使用内置 imagegen 生成的原创奶油色毛绒小熊，青绿色针织围巾、橙色缝补贴布。原图保存在 `generated-source.png`，没有使用原片角色图作为生成输入。

- `sprite-sheet.png`：4×4、16 帧透明 RGBA 图集。前 8 帧跑动循环，后 8 帧为被牵住后的撑住姿态，播放一次后保持。
- `runner-run.gif`：跑动动图预览，8 帧循环。
- `runner-brace.gif`：被牵住的姿态变化预览，8 帧，最后一帧停留。
- GIF 在浅纸色底上展示，Remotion 使用保留柔和透明绒毛边缘的 PNG 图集，不使用 GIF 时钟。

原始输出为 1254×1254；制作脚本按四等分裁出每格、以透明像素补齐至 314×314，重排成 1256×1256，不绘改角色。`metadata.json` 记录尺寸、帧率及图集哈希。

复用接口：`<TetheredMotion time={time} spriteSrc="/characters/runner-v2.png" />`。图集由调用方提供，未内嵌到 npm 包中；仓库目录站与示例的 `public/characters` 各保存同一份文件。原有 `running/caught` React 插槽仍可使用。

重新封装：`python scripts/prepare-runner-sprites.py <generated-png>`。帧控制在 `RunnerSprite.tsx` 中，逐帧可重复跳转。

生成提示词见 `PROMPT.md`。尚未做浏览器视觉验收或更新完整 MP4，由用户确认最终角色效果。
