import {useRef, useState} from 'react';
import type {KeyboardEvent} from 'react';
import {catalog, categories} from './catalog';
import type {CategoryId} from './catalog';
import {getNextCategoryIndex} from './interaction';
import {MaterialCard} from './MaterialCard';
import './styles.css';

export const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('layouts');
  const tabRefs = useRef<Partial<Record<CategoryId, HTMLButtonElement | null>>>({});
  const category = categories.find((item) => item.id === selectedCategory)!;
  const items = catalog.filter(item=>item.category===selectedCategory);

  const handleCategoryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, current: CategoryId) => {
    const index = getNextCategoryIndex(categories.findIndex((item) => item.id === current), categories.length, event.key);
    if (index === null) return;
    event.preventDefault();
    const next = categories[index];
    setSelectedCategory(next.id);
    tabRefs.current[next.id]?.focus();
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
        <p>把可复用的 Remotion 组件按类别收进持续扩展的素材库，悬浮卡片即可查看动效。</p>
        <div className="hero-actions"><a className="button-primary" href="#library">查看素材库 ↗</a></div>
        <div className="hero-stats"><span><strong>{String(categories.length).padStart(2, '0')}</strong> 个分类</span><span><strong data-testid="material-count">{String(catalog.length).padStart(2, '0')}</strong> 个正式素材</span></div>
      </section>
      <section id="library" className="workspace">
        <div className="section-heading"><div><div className="overline">/ COMPONENT LIBRARY</div><h2>{category.name}</h2></div><p>{items.length?`${items.length} 个可复用组件`:'更多组件持续整理中。'}</p></div>
        <div className="category-tabs" role="tablist" aria-label="素材分类">
          {categories.map((item) => <button key={item.id} id={`category-${item.id}`} type="button" role="tab" aria-selected={item.id === selectedCategory} aria-controls="catalog-panel" tabIndex={item.id === selectedCategory ? 0 : -1} ref={(element) => {tabRefs.current[item.id] = element;}} onKeyDown={(event) => handleCategoryKeyDown(event, item.id)} className={`category-tab${item.id === selectedCategory ? ' active' : ''}`} onClick={() => setSelectedCategory(item.id)}><span>{item.name}</span><small>{catalog.filter(material=>material.category===item.id).length||'整理中'}</small></button>)}
        </div>
        <div id="catalog-panel" role="tabpanel" aria-labelledby={`category-${selectedCategory}`}>
          {items.length?<div className="material-grid">{items.map(item=><MaterialCard key={item.id} item={item}/>)}</div>:<div className="empty-category"><span className="empty-mark" aria-hidden="true">✦</span><strong>{category.name}正在整理中，后续组件会继续加入。</strong></div>}
        </div>
      </section>
    </main>
    <footer className="footer"><span>✦ remotions / library</span><span>把动效收进可复用的分类。</span><span>MIT 开源许可</span></footer>
  </div>;
};
