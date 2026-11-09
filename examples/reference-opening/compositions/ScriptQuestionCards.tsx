import type {ReactNode} from 'react';
import {CardEntrance} from '../../../packages/animations/src';
import {during} from '../../../packages/animations/src/reference-opening/motion';

/** The two reference question cards; all timing is relative to the 96-second boundary. */
export const ScriptQuestionCards=({time,thumbnails}:{time:number;thumbnails:readonly ReactNode[]})=><>
  {[0,1].map(i=><CardEntrance key={i} progress={during(time,.3+i*1.7,1+i*1.7)} x={54+i*360} y={125} width={335} height={232} borderRadius={12} offset={{x:0,y:20}}>
    <div data-question-visual={i} style={{position:'absolute',left:17,top:17,width:301,height:137,background:'#f7f7f3'}}>
      {i===0?<>
        <div style={{position:'absolute',left:16,top:16}}>{[166,151,171,108].map((width,n)=><div key={n} style={{height:5,width,background:'#d8dbd5',marginBottom:7}}/>)}</div>
        <div style={{position:'absolute',left:16,top:71,width:159,height:23,boxSizing:'border-box',borderLeft:'2px solid #dc7351',padding:'6px 7px',fontFamily:'monospace',fontSize:8,background:'#f6e9e2',color:'#b3684c'}}>› 可用素材：demo.mp4、2.png</div>
        {thumbnails.slice(0,2).map((content,n)=><div key={n} data-question-thumbnail={n} style={{position:'absolute',left:198+n*9,top:28+n*47,width:77,height:43,padding:3,boxSizing:'border-box',borderRadius:3,background:'#fff',boxShadow:'0 5px 9px #30343e19',overflow:'hidden',transform:`rotate(${n===0?-5:5}deg)`,opacity:during(time,1+n*.25,1.4+n*.25)}}>{content}</div>)}
      </>:<>
        {[0,1,2].map(n=><div key={n} data-question-shot={n} style={{position:'absolute',left:15+n*97,top:16,width:78,height:49,borderRadius:3,boxSizing:'border-box',padding:'3px 4px 4px',background:'white',boxShadow:'0 4px 8px #30343e15',opacity:during(time,2.3+n*.18,2.65+n*.18)}}>
          <div style={{fontFamily:'monospace',fontSize:5,color:'#999',height:9}}>SHOT 0{n+1}</div>
          <div style={{height:29,background:['#f5e0d5','#e3e1f4','#dceee3'][n]}}/>
        </div>)}
        {[0,1].map(n=><span key={n} data-shot-arrow style={{position:'absolute',left:96+n*97,top:33,color:'#949992',fontSize:13,opacity:during(time,2.65+n*.18,2.95+n*.18)}}>→</span>)}
        <div data-shot-planning-note style={{position:'absolute',left:16,right:12,top:88,borderLeft:'2px solid #dc7351',padding:'6px 7px',background:'#f6e9e2',color:'#b3684c',fontSize:8,opacity:during(time,4.5,5)}}>› 动画规划：左右分屏，两个画面依次出现，最后加对比标记……</div>
      </>}
    </div>
    <div style={{position:'absolute',left:17,bottom:39,display:'flex',alignItems:'center',gap:8,fontSize:18,fontWeight:800,whiteSpace:'nowrap'}}><span style={{display:'inline-flex',width:25,height:25,borderRadius:'50%',alignItems:'center',justifyContent:'center',background:'#dc7351',color:'#fff',fontSize:15}}>{i+1}</span>{i===0?'要不要备注对应素材？':'要不要写每一段的动画要求？'}</div>
  </CardEntrance>)}
</>;
