import {useId,useState} from 'react';
import type {MaterialId} from './catalog';
import {getExampleUsage,getMaterialExamples,type MaterialExample} from './exampleRegistry';

const Example=({example}:{example:MaterialExample})=>{
  const [open,setOpen]=useState(false),id=useId();
  return <div className="material-example" data-material-example={example.id}>
    <button type="button" className="example-toggle" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(value=>!value)}>{open?'收起':'查看'}完整范例 · {example.name}</button>
    {open&&<section id={id} className="example-content" aria-label={`${example.name}完整范例`}>
      <div className="example-heading"><strong>{example.name}</strong><span>{example.composition.durationInFrames/example.composition.fps} 秒 · {example.reviewStatus==='approved'?'已确认':'待确认'}</span></div>
      <video aria-label={`${example.name}完整范例预览`} src={example.preview.video} poster={example.preview.poster} controls muted playsInline preload="none"/>
      <p>{example.description}</p>
      <dl><dt>适合</dt><dd>{example.useCases.join(' · ')}</dd><dt>可以替换</dt><dd>{example.replaceable.join('、')}</dd><dt>沿用效果</dt><dd>{example.preserve.join('；')}</dd></dl>
      <details className="material-code"><summary>查看范例用法</summary><pre><code>{getExampleUsage(example)}</code></pre><a className="example-guide" href={example.preview.guide} target="_blank" rel="noreferrer">完整使用说明 ↗</a></details>
    </section>}
  </div>;
};

export const MaterialExamples=({materialId}:{materialId:MaterialId})=><>{getMaterialExamples(materialId).map(example=><Example key={example.id} example={example}/>)}</>;
