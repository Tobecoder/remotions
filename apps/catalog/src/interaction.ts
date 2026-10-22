export type CategoryNavigationKey = 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End';

/** Return the category index selected by a tab-list navigation key. */
export const getNextCategoryIndex = (
  currentIndex: number,
  categoryCount: number,
  key: string,
): number | null => {
  if (categoryCount <= 0 || currentIndex < 0 || currentIndex >= categoryCount) return null;
  if (key === 'ArrowRight') return (currentIndex + 1) % categoryCount;
  if (key === 'ArrowLeft') return (currentIndex - 1 + categoryCount) % categoryCount;
  if (key === 'Home') return 0;
  if (key === 'End') return categoryCount - 1;
  return null;
};

/** Keyboard clicks have no pointer detail; touch clicks retain their pointer type. */
export const isPreviewToggleActivation = (detail: number, pointerType: string | null): boolean => (
  pointerType === 'touch' || (detail === 0 && pointerType === null)
);

export const togglePreview = (active: boolean): boolean => !active;
