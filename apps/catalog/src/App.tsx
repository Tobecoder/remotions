import {useRef, useState} from 'react';
import type {CSSProperties, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent} from 'react';
import {CatalogCardPreview} from './CatalogCardPreview';
import type {CatalogCardPreviewHandle} from './CatalogCardPreview';
import {catalog, categories, demoAudioSrc, demoCaptions} from './catalog';
import type {CategoryId, DemoId} from './catalog';
import './styles.css';

export const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('audio');
  const [selected, setSelected] = useState<DemoId>('oscilloscope');
  const [hovered, setHovered] = useState<DemoId | null>(null);
  const lastPointerType = useRef<string | null>(null);
  const categoryTabRefs = useRef<Partial<Record<CategoryId, HTMLButtonElement | null>>>({});
  const previewRefs = useRef<Partial<Record<DemoId, CatalogCardPreviewHandle | null>>>({});
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0];
  const categoryItems = catalog.filter((item) => item.category === selectedCategory);
  const src = demoAudioSrc;

  const chooseCategory = (next: CategoryId) => {
    const nextCategory = categories.find((item) => item.id === next);
    if (!nextCategory) return;
    const first = catalog.find((item) => item.category === next);
    setSelectedCategory(next);
    setHovered(null);
    if (first) setSelected(first.id);
  };

  const handleCategoryKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, current: CategoryId) => {
    const currentIndex = categories.findIndex((item) => item.id === current);
    if (currentIndex < 0 || categories.length === 0) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % categories.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + categories.length) % categories.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = categories.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const next = categories[nextIndex];
    chooseCategory(next.id);
    categoryTabRefs.current[next.id]?.focus();
  };

  const handleCardClick = (itemId: DemoId, event: ReactMouseEvent<HTMLButtonElement>) => {
    const nativePointerType = (event.nativeEvent as MouseEvent & {pointerType?: string}).pointerType;
    const clickPointerType = nativePointerType || lastPointerType.current;
    const isTouch = clickPointerType === 'touch';
    setSelected(itemId);
    if (isTouch) {
      if (hovered === itemId) {
        setHovered(null);
        previewRefs.current[itemId]?.stop();
      } else {
        setHovered(itemId);
      }
    }
    lastPointerType.current = null;
  };

  return <div className="app" id="top">
    <header className="header">
      <a className="brand" href="#top" aria-label="Remotions 首页"><span className="brand-logo">✦</span><span>remotions</span><sup>LIBRARY / 01</sup></a>
      <nav className="nav" aria-label="主导航"><a href="#library">素材库</a><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>

    <main>
      <section className="hero">
        <div className="eyebrow"><span className="live-dot" /> REMOTION 动效素材库</div>
        <h1>让素材<span>随时可用</span></h1>
        <p>把可复用的 Remotion 组件按类别收进一个持续扩展的库。现在从音频动画、字幕动画、背景特效和视觉效果开始，悬浮卡片即可看到逐帧动效。</p>
        <div className="hero-actions"><a className="button-primary" href="#library">探索素材库 ↗</a></div>
        <div className="hero-stats"><span><strong>{String(categories.length).padStart(2, '0')}</strong> 个分类骨架</span><span><strong>{String(catalog.length).padStart(2, '0')}</strong> 个已开放组件</span><span><strong>30 FPS</strong> 逐帧预览</span></div>
      </section>

      <section id="library" className="workspace">
        <div className="section-heading"><div><div className="overline">/ COMPONENT LIBRARY</div><h2>{category.name}</h2></div><p>悬浮卡片，在卡片内查看 Remotion 动效。</p></div>
        <div className="category-tabs" role="tablist" aria-label="素材分类">
          {categories.map((item) => {
            const count = catalog.filter((demo) => demo.category === item.id).length;
            const isSelected = item.id === selectedCategory;
            return <button key={item.id} type="button" role="tab" aria-selected={isSelected} aria-controls="catalog-panel" tabIndex={isSelected ? 0 : -1} ref={(element) => {categoryTabRefs.current[item.id] = element;}} onKeyDown={(event) => handleCategoryKeyDown(event, item.id)} className={`category-tab${isSelected ? ' active' : ''}${item.status === 'coming-soon' ? ' upcoming' : ''}`} onClick={() => chooseCategory(item.id)}>
              <span>{item.name}</span><small>{item.status === 'active' ? `${count} 个组件` : '即将上线'}</small>
            </button>;
          })}
        </div>
        <div id="catalog-panel" role="tabpanel" aria-label={`${category.name}组件`}>
          {categoryItems.length > 0 ? <div className="catalog-grid">{categoryItems.map((item) => <button key={item.id} type="button" className={selected === item.id ? 'motion-card selected' : 'motion-card'} style={{'--card-accent': item.color} as CSSProperties} aria-pressed={hovered === item.id} aria-label={hovered === item.id ? `停止预览${item.name}` : `预览${item.name}`} onPointerDown={(event) => {lastPointerType.current = event.pointerType;}} onPointerUp={(event) => {if (event.pointerType !== 'touch') lastPointerType.current = null;}} onPointerCancel={() => {lastPointerType.current = null; setHovered(null); previewRefs.current[item.id]?.stop();}} onPointerEnter={(event) => {if (event.pointerType === 'touch') return; setHovered(item.id); previewRefs.current[item.id]?.start(event);}} onPointerLeave={(event) => {if (event.pointerType === 'touch') return; setHovered(null); previewRefs.current[item.id]?.stop();}} onFocus={(event) => {if (lastPointerType.current === 'touch') return; setHovered(item.id); previewRefs.current[item.id]?.start(event);}} onBlur={() => {setHovered(null); previewRefs.current[item.id]?.stop();}} onClick={(event) => handleCardClick(item.id, event)}>
            <div className={`mini-art mini-${item.id}`}><CatalogCardPreview ref={(handle) => {previewRefs.current[item.id] = handle;}} inputProps={{id: item.id, src, captions: demoCaptions}} active={hovered === item.id} /></div>
            <div className="motion-card-info"><div className="motion-card-copy"><div className="motion-card-title"><strong>{item.name}</strong><span className="motion-card-use-case">{item.useCase}</span></div><span className="motion-description">{item.description}</span></div></div>
          </button>)}</div> : <div className="empty-category"><span className="empty-mark">✦</span><strong>{category.name}正在整理中，后续组件会继续加入。</strong></div>}
        </div>
      </section>
    </main>
    <footer className="footer"><span>✦ remotions / library</span><span>把动效收进可复用的分类。</span><span>MIT 开源许可</span></footer>
  </div>;
};
