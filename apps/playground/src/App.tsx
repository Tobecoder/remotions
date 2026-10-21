import {useMemo, useState} from 'react';
import {Player} from '@remotion/player';
import {catalog, PreviewComposition} from './catalog';
import type {Category, DemoId} from './catalog';
import {previewFrames} from './timing';
import './styles.css';

const categories: Array<'All' | Category> = ['All', 'Entrance', 'Typography', 'Data', 'UI'];
const previewProps = {headline: 'Hello Motion', accent: '#9d8cff', durationInFrames: 36, delayInFrames: 0} as const;

export const App = () => {
  const [selected, setSelected] = useState<DemoId>('spring');
  const [category, setCategory] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => catalog.filter((item) =>
    (category === 'All' || item.category === category) &&
    `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(search.toLowerCase()),
  ), [category, search]);
  const active = catalog.find((item) => item.id === selected)!;
  const totalFrames = previewFrames(selected, previewProps.headline, previewProps.durationInFrames, previewProps.delayInFrames);

  return <div className="app">
    <header className="header">
      <a className="brand" href="#top" aria-label="Remotions home"><span className="brand-logo">✦</span><span>remotions</span><sup>V0.1</sup></a>
      <nav className="nav"><a href="#library">Library</a><a href="#preview">Preview</a><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="eyebrow"><span className="live-dot" /> OPEN-SOURCE REMOTION COMPONENTS</div>
        <h1>Motion that makes<br/><em>everything</em> move<span className="period">.</span></h1>
        <p>A curated library of beautiful, reusable animations for your React videos. Browse the collection and preview each motion in action.</p>
        <div className="hero-actions"><a className="button-primary" href="#library">Explore library <span>↗</span></a><a className="button-ghost" href="https://www.remotion.dev/docs" target="_blank" rel="noreferrer">Remotion docs →</a></div>
        <div className="hero-stats"><span><strong>11</strong> components</span><span><strong>4</strong> categories</span><span><strong>100%</strong> frame-driven</span></div>
      </section>

      <section className="workspace" id="library">
        <div className="section-heading"><div><div className="overline">/ THE COLLECTION</div><h2>Find your motion<span className="period">.</span></h2></div><p>Crafted for creators who care about the details.</p></div>
        <div className="filter-row"><div className="tabs" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} className={category === item ? 'tab active' : 'tab'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><input className="search" aria-label="Search components" placeholder="⌕  Search animations..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="catalog-grid">{filtered.length === 0 ? <div className="empty">No animations found. Try another category or search.</div> : filtered.map((item) => <button key={item.id} className={selected === item.id ? 'motion-card selected' : 'motion-card'} onClick={() => {setSelected(item.id); document.getElementById('preview')?.scrollIntoView({behavior: 'smooth', block: 'start'});}} aria-label={`Preview ${item.name}`}>
          <div className={`mini-art mini-${item.id}`}><span className="mini-orbit" /><span className="mini-content">{item.id === 'ring' ? '◉' : item.id === 'bar' ? '▰▰▰' : item.id === 'count' ? '12.8k' : item.id === 'typewriter' ? 'Hello|' : item.id === 'card' ? '▣' : item.id === 'wave' ? '∿∿∿' : item.id === 'words' ? 'WORD BY WORD' : 'Aa'}</span></div>
          <div className="motion-card-info"><div><strong>{item.name}</strong><span className="motion-description">{item.description}</span></div><span className="card-arrow">↗</span></div><div className="motion-card-foot"><span>{item.category}</span><span>{item.tag}</span></div>
        </button>)}</div>
      </section>

      <section id="preview" className="preview">
        <div className="section-heading">
          <div><div className="overline">/ LIVE PREVIEW</div><h2>See it in motion<span className="period">.</span></h2></div>
          <p>Select an animation from the collection to watch it play.</p>
        </div>
        <div className="preview-panel">
          <div className="panel-title"><span><span className="panel-dot" /> LIVE PREVIEW</span><span>{active.name}</span></div>
          <div className="player-wrap">
            <Player
              key={selected}
              component={PreviewComposition}
              inputProps={{id: selected, ...previewProps}}
              durationInFrames={totalFrames}
              fps={30}
              compositionWidth={1280}
              compositionHeight={720}
              controls
              autoPlay
              loop
              style={{width: '100%', aspectRatio: '16 / 9'}}
            />
          </div>
        </div>
      </section>
      <section className="bottom-banner"><span>✦</span><div><h2>Build something moving.</h2><p>Open-source, developer-first, powered by Remotion.</p></div><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">View on GitHub ↗</a></section>
    </main>
    <footer className="footer"><span>✦ remotions / 0.1.0</span><span>Made for the frame.</span><span>MIT LICENSE</span></footer>
  </div>;
};
