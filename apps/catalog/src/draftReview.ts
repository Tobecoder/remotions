import type {ScreenshotFocusDraftProps} from '../../../packages/animations/src/drafts/ScreenshotFocusDraft';

export const screenshotExamples: {id: string; name: string; props: ScreenshotFocusDraftProps}[] = [
  {id: 'document', name: '讲解文档', props: {src: '/review/window-focus/document.svg', imageWidth: 1440, imageHeight: 760, focus: {x: 0.06, y: 0.497, width: 0.65, height: 0.06}, note: '先看完整画面，再把注意力引向关键段落。'}},
  {id: 'code', name: '代码截图', props: {src: '/review/window-focus/code.svg', imageWidth: 1440, imageHeight: 760, focus: {x: 0.06, y: 0.60, width: 0.65, height: 0.065}, note: '替换截图和重点位置，保留相同的动作与节奏。'}},
];

// The screenshot experiment was self-designed; its claimed reference match was withdrawn.
export const draftMaterials: readonly {id: string; name: string; status: 'awaiting-review'}[] = [];
