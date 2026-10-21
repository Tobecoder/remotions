import {useMemo, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import type {PlayerRef} from '@remotion/player';
import {catalog, PreviewComposition, snippetFor} from './catalog';
import type {Category, DemoId} from './catalog';
import {previewFrames} from './timing';
import './styles.css';

const categories: Array<'All' | Category> = ['All', 'Entrance', 'Typography', 'Data', 'UI'];

export const App = () => {
  const [selected, setSelected] = useState<DemoId>('spring');
  const [category, setCategory] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');
  const [headline, setHeadline] = useState('Hello Motion');
  const [accent, setAccent] = useState('#9d8cff');
  const [duration, setDuration] = useState(36);
  const [delay, setDelay] = useState(0);
  const playerRef = useRef<PlayerRef>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => catalog.filter((item) =>
    (category === 'All' || item.category === category) &&
    `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(search.toLowerCase()),
  ), [category, search]);
  const active = catalog.find((item) => item.id === selected)!;
  const snippet = snippetFor(selected, headline, accent, duration, delay);
  const totalFrames = previewFrames(selected, headline, duration, delay);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return <div className="app">
    <header className="header">
      <a className="brand" href="#top" aria-label="Remotions home"><span className="brand-logo">✦</span><span>remotions</span><sup>V0.1</sup></a>
      <nav className="nav"><a href="#library">Library</a><a href="#preview">Playground</a><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    </header>

    <main id="top">
      <section className="hero">
        <div className="eyebrow"><span className="live-dot" /> OPEN-SOURCE REMOTION COMPONENTS</div>
        <h1>Motion that makes<br/><em>everything</em> move<span className="period">.</span></h1>
        <p>A curated library of beautiful, reusable animations for your React videos. Explore, customize, and copy into your next project.</p>
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

      <section id="preview" className="playground"><div className="section-heading"><div><div className="overline">/ THE PLAYGROUND</div><h2>Make it yours<span className="period">.</span></h2></div><p>Fine-tune a motion, then take the code.</p></div>
        <div className="editor">
          <div className="player-pane">
            <div className="panel-title"><span><span className="panel-dot" /> LIVE PREVIEW</span><span>1280 × 720 · 30 FPS</span></div>
            <div className="player-wrap"><Player ref={playerRef} key={`${selected}:${headline}:${duration}:${delay}`} component={PreviewComposition} inputProps={{id: selected, headline, accent, durationInFrames: duration, delayInFrames: delay}} durationInFrames={totalFrames} fps={30} compositionWidth={1280} compositionHeight={720} controls autoPlay loop style={{width: '100%', aspectRatio: '16 / 9'}} /></div>
            <div className="player-bottom"><span>✦ {active.name} · {totalFrames} frames</span><button type="button" onClick={() => {playerRef.current?.seekTo(0); playerRef.current?.play();}} className="replay-button">↻ Replay</button></div>
            <div className="code-heading"><span>CODE SNIPPET</span><button onClick={copyCode} className="copy-button">{copied ? '✓ Copied!' : '⧉ Copy code'}</button></div>
            <pre className="code-block"><code>{snippet}</code></pre>
          </div>
          <aside className="controls-pane"><div className="controls-heading"><span className="controls-icon">⚙</span><div><h3>Customize</h3><p>Adjust the animation parameters</p></div></div>
            <div className="control-group"><label htmlFor="preset">Component</label><select id="preset" value={selected} onChange={(event) => setSelected(event.target.value as DemoId)}>{catalog.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
            <div className="control-group"><label htmlFor="headline">Your text</label><input id="headline" type="text" maxLength={34} value={headline} onChange={(event) => setHeadline(event.target.value)} /></div>
            <div className="control-group"><label htmlFor="duration">Duration <span className="control-value">{duration} frames · {(duration / 30).toFixed(1)}s</span></label><input id="duration" type="range" min="8" max="90" step="1" value={duration} onChange={(event) => setDuration(Number(event.target.value))}/></div>
            <div className="control-group"><label htmlFor="delay">Delay <span className="control-value">{delay} frames</span></label><input id="delay" type="range" min="0" max="60" step="1" value={delay} onChange={(event) => setDelay(Number(event.target.value))}/></div>
            <div className="control-group"><label htmlFor="accent">Accent color</label><div className="color-control"><input aria-label="Choose accent color" type="color" id="accent" value={accent} onChange={(event) => setAccent(event.target.value)}/><span>{accent.toUpperCase()}</span></div></div>
            <div className="controls-note"><strong>Frame perfect.</strong><br/>All effects use Remotion's current frame instead of CSS transitions. They render deterministically, frame by frame.</div>
          </aside>
        </div>
      </section>
      <section className="bottom-banner"><span>✦</span><div><h2>Build something moving.</h2><p>Open-source, developer-first, powered by Remotion.</p></div><a href="https://github.com/Tobecoder/remotions" target="_blank" rel="noreferrer">View on GitHub ↗</a></section>
    </main>
    <footer className="footer"><span>✦ remotions / 0.1.0</span><span>Made for the frame.</span><span>MIT LICENSE</span></footer>
  </div>;
};
