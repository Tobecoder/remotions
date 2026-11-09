import type {ReactNode} from 'react';
import {TypewriterComparison} from '../../../packages/animations/src';
import {getComparisonThumbnailRect} from '../../../packages/animations/src/reference-opening/TypewriterComparison';

export const writingComparisonDefaults={
  ownText:'我上期那条 16 分钟的讲解视频，\n是怎么从脚本到成片的？\n这期就拿它来复盘，\n继续聊聊用 Remotion 制作视频的方法。',
  aiText:'在当今快速发展的时代，\n值得注意的是，\n这不仅仅是……更是……\n赋能 · 闭环 · 抓手\n让我们一起探索吧！',
  copy:{headingPrefix:'主要',headingEmphasis:'自己写',headingSuffix:'，AI 辅助校验',leftColumn:'我自己写',rightColumn:'交给 AI 写',leftLabel:'我写的',rightLabel:'AI 写的',checkLabel:'AI 校验 · 2 处建议',critique:'没有体感',leftTitle:'我的视频脚本',leftDescription:'分享经验与体会',rightTitle:'『Vibe 知识大赏』',rightDescription:'知识科普，可以让 AI 写'},
};
export type WritingComparisonCopy=typeof writingComparisonDefaults.copy;
export type WritingComparisonProps={time:number;startAt?:number;ownText?:string;aiText?:string;ownThumbnail?:ReactNode;aiThumbnail?:ReactNode;copy?:Partial<WritingComparisonCopy>};

/** Case-owned wording and opinion; the library provides the complete neutral comparison motion. */
export const WritingComparison=({time,startAt=0,ownText=writingComparisonDefaults.ownText,aiText=writingComparisonDefaults.aiText,ownThumbnail,aiThumbnail,copy}:WritingComparisonProps)=>{
  const text={...writingComparisonDefaults.copy,...copy};
  return <TypewriterComparison time={time} startAt={startAt}
    heading={<>{text.headingPrefix}<span style={{color:'#ce6d4d'}}>{text.headingEmphasis}</span>{text.headingSuffix}</>}
    left={{text:ownText,label:text.leftLabel,columnTitle:text.leftColumn,thumbnail:ownThumbnail,compactTitle:text.leftTitle,compactDescription:text.leftDescription}}
    right={{text:aiText,label:text.rightLabel,columnTitle:text.rightColumn,thumbnail:aiThumbnail,compactTitle:text.rightTitle,compactDescription:text.rightDescription}}
    check={{label:text.checkLabel}} dim={{badge:text.critique}} compact={{}} />;
};

// This later zoom is part of the original case, not a second layout implementation.
export const getAiComparisonThumbnailRect=(time:number,startAt=0)=>getComparisonThumbnailRect('right',time,startAt);
