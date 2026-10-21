import {useEffect, useRef, useState} from 'react';
import type {CSSProperties} from 'react';
import {CatalogCardPreview} from './CatalogCardPreview';
import type {CatalogCardPreviewHandle} from './CatalogCardPreview';
import {catalog, categories, demoAudioSrc, previewDurationInFrames, snippetFor} from './catalog';
import type {CategoryId, DemoId} from './catalog';
import {CatalogPlayer} from './CatalogPlayer';
import './styles.css';

type UploadedAudio = {url: string; name: string};

export const App = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('audio');
  const [selected, setSelected] = useState<DemoId>('oscilloscope');
  const [hovered, setHovered] = useState<DemoId | null>(null);
  const [uploaded, setUploaded] = useState<UploadedAudio | null>(null);
  const [notice, setNotice] = useState('');
  const previewRefs = useRef<Partial<Record<DemoId, CatalogCardPreviewHandle | null>>>({});
  const category = categories.find((item) => item.id === selectedCategory) ?? categories[0];
  const categoryItems = catalog.filter((item) => item.category === selectedCategory);
  const active = categoryItems.find((item) => item.id === selected) ?? categoryItems[0];
  const src = uploaded?.url ?? demoAudioSrc;

  useEffect(() => () => {if (uploaded) URL.revokeObjectURL(uploaded.url);}, [uploaded]);

  const chooseCategory = (next: CategoryId) => {
    const nextCategory = categories.find((item) => item.id === next);
    if (!nextCategory) return;
    if (nextCategory.status === 'coming-soon') {
      setNotice(`${nextCategory.name}正在整理中，先收藏这个分类，后续组件会继续加入。`);
      return;
    }
    const first = catalog.find((item) => item.category === next);
    setSelectedCategory(next);
    setHovered(null);
    if (first) setSelected(first.id);
  };

  const chooseAudio = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('audio/') && !/\.(wav|mp3|m4a|aac|ogg)$/i.test(file.name)) {
      setNotice('请选择音频文件（WAV、MP3、M4A、AAC 或 OGG）。');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setNotice('请选用不超过 25 MB 的音频，便于即时预览。');
      return;
    }
    setUploaded({url: URL.createObjectURL(file), name: file.name});
    setNotice('已载入本地音频，卡片悬浮预览与下方试听会使用同一个音频源。');
  };

  const copyCode = async () => {
    if (!active) {
      setNotice('请先选择一个已开放分类中的组件。');
      return;
    }
    try {
      await navigator.clipboard.writeText(snippetFor(active.id));
      setNotice(`已复制 ${active.componentName} 的 Remotion 示例代码。`);
    } catch {
      setNotice('复制失败，请检查浏览器的剪贴板权限。');
    }
  };

  return <div className="app" id="top">
    <header className="header">
      <a className="brand" href="#top" aria-label="Remotions 首页"><span className="brand-logo">✦</span><span>remotions</span><sup>LIBRARY / 01</sup></a>
      <nav className="nav" aria-label="主导航"><a href="#library">素材库</a><a href="#preview">实时预览</a><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>

    <main>
      <section className="hero">
        <div className="eyebrow"><span className="live-dot" /> REMOTION 动效素材库</div>
        <h1>让素材<span>随时可用</span>。</h1>
        <p>把可复用的 Remotion 组件按类别收进一个持续扩展的库。现在从音频动画开始，悬浮卡片即可看到逐帧动效，选中后还能试听自己的音频。</p>
        <div className="hero-actions"><a className="button-primary" href="#library">探索素材库 ↗</a><a className="button-ghost" href="#preview">立即预览 →</a></div>
        <div className="hero-stats"><span><strong>{String(categories.length).padStart(2, '0')}</strong> 个分类骨架</span><span><strong>{String(catalog.length).padStart(2, '0')}</strong> 个已开放组件</span><span><strong>30 FPS</strong> 逐帧预览</span></div>
      </section>

      <section id="library" className="workspace">
        <div className="section-heading"><div><div className="overline">/ COMPONENT LIBRARY</div><h2>{category.name}<span className="period">。</span></h2></div><p>悬浮卡片，在卡片内查看 Remotion 动效。</p></div>
        <div className="category-tabs" role="tablist" aria-label="素材分类">
          {categories.map((item) => {
            const count = catalog.filter((demo) => demo.category === item.id).length;
            const isSelected = item.id === selectedCategory;
            return <button key={item.id} type="button" role="tab" aria-selected={isSelected} aria-controls="catalog-panel" aria-disabled={item.status === 'coming-soon'} className={`category-tab${isSelected ? ' active' : ''}${item.status === 'coming-soon' ? ' upcoming' : ''}`} onClick={() => chooseCategory(item.id)}>
              <span>{item.name}</span><small>{item.status === 'active' ? `${count} 个组件` : '即将上线'}</small>
            </button>;
          })}
        </div>
        <div id="catalog-panel" role="tabpanel" aria-label={`${category.name}组件`}>
          {categoryItems.length > 0 ? <div className="catalog-grid">{categoryItems.map((item) => <button key={item.id} type="button" className={selected === item.id ? 'motion-card selected' : 'motion-card'} style={{'--card-accent': item.color} as CSSProperties} aria-pressed={selected === item.id} aria-label={`预览${item.name}`} onPointerEnter={(event) => {setHovered(item.id); previewRefs.current[item.id]?.start(event);}} onPointerLeave={() => {setHovered(null); previewRefs.current[item.id]?.stop();}} onFocus={(event) => {setHovered(item.id); previewRefs.current[item.id]?.start(event);}} onBlur={() => {setHovered(null); previewRefs.current[item.id]?.stop();}} onClick={() => {setSelected(item.id); document.getElementById('preview')?.scrollIntoView({behavior: 'smooth', block: 'start'});}}>
            <div className={`mini-art mini-${item.id}`}><CatalogCardPreview ref={(handle) => {previewRefs.current[item.id] = handle;}} inputProps={{id: item.id, src}} active={hovered === item.id} /></div>
            <div className="motion-card-info"><div><span className="card-index">{item.tag} / {category.name}</span><strong>{item.name}</strong><span className="motion-description">{item.description}</span></div><span className="card-arrow">↗</span></div>
            <div className="motion-card-foot">{item.useCase}</div>
          </button>)}</div> : <div className="empty-category"><span className="empty-mark">✦</span><strong>{category.name}正在准备中</strong><p>{category.description}。分类已经预留，下一批组件会直接出现在这里。</p></div>}
        </div>
      </section>

      <section id="preview" className="preview">
        <div className="section-heading"><div><div className="overline">/ LIVE PREVIEW</div><h2>听见，也看见<span className="period">。</span></h2></div><p>完整试听会播放声音；卡片悬浮只播放画面，避免打扰浏览。</p></div>
        {active ? <>
          <div className="audio-source-row"><div><span className="source-dot" /> 当前音频：<strong>{uploaded?.name ?? '原创示例音频'}</strong><small>预览前 6 秒</small></div><div className="source-actions"><label className="upload-button">选择本地音频<input type="file" accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg" onChange={(event) => {chooseAudio(event.target.files?.[0]); event.target.value = '';}} /></label>{uploaded && <button type="button" onClick={() => {setUploaded(null); setNotice('已恢复示例音频。');}}>恢复示例</button>}</div></div>
          <div className="preview-panel"><div className="panel-title"><span><span className="panel-dot" /> 动画预览</span><span>{active.name} / {active.componentName}</span></div><CatalogPlayer key={`${selected}-${src}`} inputProps={{id: active.id, src}} durationInFrames={previewDurationInFrames} /></div>
          <div className="usage-row"><div><strong>放进你的 Remotion 工程</strong><p>复制组件示例，将 <code>your-audio.wav</code> 换成自己的音频文件。播放声音与画面使用同一个音频源。</p></div><button type="button" className="copy-button" onClick={copyCode}>复制示例代码 ↗</button></div>
        </> : <div className="empty-preview"><strong>先选择一个已开放分类</strong><p>当前分类还没有可以试听的组件。</p></div>}
        {notice && <p className="notice" role="status">{notice}</p>}
      </section>
    </main>
    <footer className="footer"><span>✦ remotions / library</span><span>把动效收进可复用的分类。</span><span>MIT 开源许可</span></footer>
  </div>;
};
