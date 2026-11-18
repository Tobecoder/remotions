import {CardEntrance,ContentCollapse} from '../../../packages/animations/src';
import {during,mix} from '../../../packages/animations/src/reference-opening/motion';

/** Case-only document excerpt, transcribed and staged from the observed reference. */
export const ScriptPlanningExcerpt=({time:t,compareAt}:{time:number;compareAt?:number})=>{
  const firstScroll=during(t,.95,1.55),secondScroll=during(t,2.6,3.25),highlight=during(t,3.05,3.9);
  const pageStyle={height:320,boxSizing:'border-box' as const,padding:'20px 24px',fontSize:12,lineHeight:'19px',color:'#222'};
  const documentX=102, documentY=139, documentWidth=598;
  const scale=336/documentWidth;
  const document=<CardEntrance data-planning-document progress={during(t,0,.35)} x={documentX} y={mix(107,documentY,secondScroll)} width={documentWidth} height={mix(292,210,secondScroll)} offset={{x:0,y:60}} borderRadius={8} boxShadow="0 9px 18px #30343e22">
      <div data-planning-scroll style={{position:'absolute',inset:'0 0 auto',transform:`translateY(${-320*(firstScroll+secondScroll)}px)`}}>
        <article data-planning-page="video-models" style={pageStyle}>
          <div style={{borderTop:'1px solid #deded9',paddingTop:40}}>
            <strong style={{fontSize:15}}>1. 视频模型 vs Remotion</strong>
            <div style={{borderLeft:'2px solid #a9a1ca',paddingLeft:7}}><mark style={{background:'#f6e6a7'}}>需要有章节画面，但旁白不念章节标题</mark></div>
            <p style={{margin:'16px 0'}}>视频模型是通过神经网络生成画面，而 Remotion 是通过代码定义动画元素、运动轨迹和时间轴，再逐帧渲染成视频。一个是生成式 AI，一个是程序化动画。</p>
            <div>不兜概念，我们直接拿例子来对比：</div><div>· 同样是花朵生长的动画</div>
            <div>左边是可灵生成的，右边是用 Remotion 做的。你看花朵的形态、枝条的生长、随风摇曳的光影变化。</div>
          </div>
        </article>
        <article data-planning-page="motion-library" style={pageStyle}>
          <p>这是我长期积累下来的「动效库」，Codex 里的项目对话是这样的。</p>
          <p>当我想直接复用某个动画效果，就直接在相应的对话里，继续提需求。换成其他 Agent，打开「动效库」的项目，也是一样的。</p>
          <p>长期积累下来，这个「动效库」就相当于自己的动画资产库。</p>
          <p>甚至，你还可以在这个基础上，搭建一个动画工作台。不过建议在自己的工作流程稳定后，再折腾工作台。不然一会搭、一会改，纯纯给自己添堵。</p>
        </article>
        <article data-planning-page="model-agent" style={{...pageStyle,height:210}}>
          <strong style={{fontSize:15}}>2. 模型与 Agent：能力和局限</strong>
          <div>「副标题」模型能力差异、Agent工程设计与限制</div>
          <p style={{margin:'16px 0 0'}}>现在主流大模型的能力，其实已经形成明显的梯队。就拿Claude Opus5.5、GPT Astra、Deepseek-v4来举例。</p>
          <div style={{borderLeft:'2px solid #a9a1ca',paddingLeft:7,whiteSpace:'nowrap',fontSize:11.5}}><span style={{position:'relative'}}><span data-planning-highlight style={{position:'absolute',left:0,top:0,bottom:0,width:`${highlight*100}%`,background:'#f6e6a7'}}/><span style={{position:'relative'}}>Claude把鸡蛋撒Codex脑门上，再把锅也甩出去；Codex把鸡蛋甩DeepSeek碗里。</span></span></div>
          <p style={{margin:'16px 0 0'}}>虽然都通过代码来制作动画，但差距不仅在于编程水平，更重要的是审美、运动设计，以及对整个动画的导演和规划能力。</p>
        </article>
      </div>
    </CardEntrance>;
  return <div data-planning-excerpt style={{position:'absolute',inset:0}}>
    <div data-planning-example-label style={{position:'absolute',left:49,top:105,fontSize:9,letterSpacing:1,color:'#cc7254',opacity:during(t,2.75,3.15)}}>例如：对比三个模型能力那段</div>
    {compareAt===undefined?document:<ContentCollapse
      data-planning-document-collapse
      progress={during(compareAt,.08,.82)}
      to={{x:49-documentX*scale,y:documentY*(1-scale),scale}}
    >{document}</ContentCollapse>}
  </div>;
};
