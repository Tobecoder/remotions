export type CategoryId = 'audio' | 'captions' | 'charts' | 'backgrounds' | 'effects' | 'layouts' | 'overlays' | 'storytelling' | 'text-effects';
export type CatalogCategory = {id: CategoryId; name: string};
export type CatalogItem = {id: string; category: CategoryId; name: string};

export const categories: CatalogCategory[] = [
  {id: 'audio', name: '音频动画'},
  {id: 'captions', name: '字幕动画'},
  {id: 'charts', name: '数据图表'},
  {id: 'backgrounds', name: '背景特效'},
  {id: 'effects', name: '视觉效果'},
  {id: 'layouts', name: '版式转场'},
  {id: 'overlays', name: '信息叠加'},
  {id: 'storytelling', name: '叙事动画'},
  {id: 'text-effects', name: '文字特效'},
];

// Only add reference-based materials after their visual review.
export const catalog: CatalogItem[] = [];
