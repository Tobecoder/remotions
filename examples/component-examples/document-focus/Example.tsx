import type {ReactNode} from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {DocumentFocusGallery,type FocusDocument} from '../../reference-opening/compositions/DocumentFocusGallery';
import example from './example.json';

export type DocumentFocusCard={id:string;label:string;title:string;body:string};
export type DocumentFocusCopy=typeof example.defaultProps.copy;
export type DocumentFocusExampleProps={cards?:readonly DocumentFocusCard[];documents?:readonly FocusDocument[];copy?:Partial<DocumentFocusCopy>;focusContent?:ReactNode;caption?:ReactNode;badge?:string};
const colors=['#405c81','#76a8b2','#c78661','#a99ac1','#cb9e66'];

const DocumentPage=({card,index}:{card:DocumentFocusCard;index:number})=><article data-example-document={card.id} style={{padding:14,boxSizing:'border-box',height:'100%',color:'#30343e'}}>
  <div style={{fontFamily:'monospace',fontSize:7,color:'#8d9296',marginBottom:7}}>{card.label}</div>
  <h3 style={{fontSize:16,lineHeight:'20px',fontWeight:800,margin:'0 0 9px'}}>{card.title}</h3>
  <div style={{height:24,background:colors[index%colors.length]+'25',marginBottom:9}}/>
  <p style={{margin:0,fontSize:9,lineHeight:'13px',color:'#777d83'}}>{card.body}</p>
</article>;

/** The original gallery owns entry order and focus timing; this example supplies content. */
export const DocumentFocusExample=({cards=example.defaultProps.cards,documents,copy,focusContent,caption,badge=example.defaultProps.badge}:DocumentFocusExampleProps)=>{
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),text={...example.defaultProps.copy,...copy};
  const items=documents===undefined?cards.map((card,index)=>({id:card.id,content:<DocumentPage card={card} index={index}/>})):documents;
  if(items.length>5)throw new Error('文档聚焦完整范例最多支持 5 张卡片，更多内容请使用 CardEntrance 自定义布局。');
  const defaultCaption=<div data-example-document-caption><div style={{fontSize:13,letterSpacing:2,color:'#8c8e90',marginBottom:7}}>{text.captionLead}</div><div style={{fontSize:26,fontWeight:800,color:'#303339'}}>{text.captionTitle}<br/><span style={{color:'#ca6a4d'}}>{text.captionEmphasis}</span></div></div>;
  const defaultFocus=<div data-example-focus-content style={{padding:'15px 18px',height:'100%',boxSizing:'border-box',overflow:'hidden'}}>
    <div style={{fontFamily:'monospace',fontSize:8,letterSpacing:2,color:'#787d79',marginBottom:10}}>{text.focusLead}</div>
    <div style={{fontSize:17,lineHeight:'24px',color:'#25272d'}}>{text.focusText}</div>
    <div style={{height:2,background:'#c56545',margin:'10px 0 13px'}}/>
    <div style={{fontFamily:'monospace',fontSize:8,letterSpacing:2,color:'#787d79',marginBottom:8}}>{text.detailLead}</div>
    <div style={{fontSize:14,lineHeight:'22px',color:'#656b6b'}}>{text.detailText}</div>
  </div>;
  return <AbsoluteFill style={{background:'#f5f6ef',overflow:'hidden',fontFamily:'"Microsoft YaHei", "Noto Sans CJK SC", sans-serif'}}>
    <div data-component-example="document-focus-gallery" style={{position:'absolute',width:800,height:450,transformOrigin:'0 0',transform:`scale(${width/800},${height/450})`}}>
      <DocumentFocusGallery time={frame/fps} documents={items} focusContent={focusContent===undefined?defaultFocus:focusContent} caption={caption===undefined?defaultCaption:caption} badge={badge}/>
    </div>
  </AbsoluteFill>;
};
