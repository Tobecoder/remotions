import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {ScriptDocumentGuide,type ScriptDocumentGuideProps} from '../../reference-opening/compositions/ScriptDocumentGuide';
import example from './example.json';

const {paragraphs:sampleParagraphs,...defaultGuideProps}=example.defaultProps;
export type ScriptDocumentExampleProps=Omit<ScriptDocumentGuideProps,'time'|'startAt'|'document'> & {document?:ReactNode;paragraphs?:readonly string[]};

const SampleDocument=({paragraphs}:{paragraphs:readonly string[]})=><article data-example-script-document style={{minHeight:'100%',padding:'16px 20px',boxSizing:'border-box',color:'#53565e',fontSize:9.5,lineHeight:'18px'}}>
  <h3 style={{margin:'0 0 12px',fontSize:14,lineHeight:'20px',color:'#30343c'}}>内容与画面安排</h3>
  {paragraphs.map((paragraph,index)=><p key={index} style={{margin:'0 0 6px'}}><span style={{color:'#a8abae',marginRight:8,fontFamily:'monospace'}}>{String(index+1).padStart(2,'0')}</span>{paragraph}</p>)}
</article>;

/** The example shares the original chapter, document, highlight and title choreography. */
export const ScriptDocumentExample=({document,paragraphs=sampleParagraphs,copy,...props}:ScriptDocumentExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="script-document-guide" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <ScriptDocumentGuide {...defaultGuideProps} {...props} copy={{...defaultGuideProps.copy,...copy}} time={frame/fps} document={document===undefined?<SampleDocument paragraphs={paragraphs}/>:document}/>
    </div>
  </AbsoluteFill>;
};
