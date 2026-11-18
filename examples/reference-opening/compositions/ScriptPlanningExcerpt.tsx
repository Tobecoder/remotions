import type {ReactNode} from 'react';
import {CardEntrance,ContentCollapse} from '../../../packages/animations/src';
import {during} from '../../../packages/animations/src/reference-opening/motion';

const documentWidth=598;
const documentX=102;
const shadow='0 9px 18px #30343e22';
const pageStyle={boxSizing:'border-box' as const,padding:'20px 24px',fontSize:12,lineHeight:'19px',color:'#222'};

export const planningQuestionFade=(time:number)=>1-during(time,132.08,132.3);

const Annotation=({progress,children}:{progress:number;children:ReactNode})=>(
  <div style={{borderLeft:'2px solid #a9a1ca',paddingLeft:7,whiteSpace:'nowrap',fontSize:11.5}}>
    <span style={{position:'relative'}}>
      <span data-planning-highlight style={{position:'absolute',inset:'0 auto 0 0',width:`${progress*100}%`,background:'#f6e6a7'}}/>
      <span style={{position:'relative'}}>{children}</span>
    </span>
  </div>
);

type PreviewCardProps={
  id:string;
  top:number;
  height:number;
  target:{x:number;y:number};
  enter:number;
  collapse:number;
  opacity:number;
  children:ReactNode;
};

const PreviewCard=({id,top,height,target,enter,collapse,opacity,children}:PreviewCardProps)=>(
  <ContentCollapse
    data-planning-preview={id}
    from={{x:documentX,y:top,scale:1}}
    to={{...target,scale:346/documentWidth}}
    progress={collapse}
    opacity={opacity}
  >
    <CardEntrance progress={enter} x={0} y={0} width={documentWidth} height={height} offset={{x:0,y:16}} borderRadius={8} boxShadow={shadow}>
      <article data-planning-page={id} style={pageStyle}>{children}</article>
    </CardEntrance>
  </ContentCollapse>
);

/** Three separate cards. Each preview returns to its side before the model excerpt enters. */
export const ScriptPlanningExcerpt=({time,compareAt}:{time:number;compareAt?:number})=>{
  const previewOpacity=planningQuestionFade(time);
  const modelY=139;
  const modelScale=336/documentWidth;
  const modelDocument=<CardEntrance
    data-planning-document
    progress={during(time,132.14,132.39)}
    x={documentX} y={modelY} width={documentWidth} height={210}
    offset={{x:0,y:16}} borderRadius={8} boxShadow={shadow}
  >
    <article data-planning-page="model-agent" style={pageStyle}>
      <strong style={{fontSize:15}}>2. 模型与 Agent：能力和局限</strong>
      <div>「副标题」模型能力差异、Agent工程设计与限制</div>
      <p style={{margin:'16px 0 0'}}>现在主流大模型的能力，其实已经形成明显的梯队。就拿Claude Opus5.5、GPT Astra、Deepseek-v4来举例。</p>
      <Annotation progress={during(time,132.74,133.14)}>Claude把鸡蛋撒Codex脑门上，再把锅也甩出去；Codex把鸡蛋甩DeepSeek碗里。</Annotation>
      <p style={{margin:'16px 0 0'}}>虽然都通过代码来制作动画，但差距不仅在于编程水平，更重要的是审美、运动设计，以及对整个动画的导演和规划能力。</p>
    </article>
  </CardEntrance>;

  return <div data-planning-excerpt style={{position:'absolute',inset:0}}>
    {time>=129.1&&previewOpacity>0&&<PreviewCard
      id="video-models" top={106} height={292} target={{x:46,y:198}}
      enter={during(time,129.1,129.45)} collapse={during(time,130.22,130.76)} opacity={previewOpacity}
    >
      <div style={{borderTop:'1px solid #deded9',paddingTop:40}}>
        <strong style={{fontSize:15}}>1. 视频模型 vs Remotion</strong>
        <Annotation progress={during(time,129.48,129.74)}>需要有章节画面，但旁白不念章节标题</Annotation>
        <p style={{margin:'16px 0'}}>视频模型是通过神经网络生成画面，而 Remotion 是通过代码定义动画元素、运动轨迹和时间轴，再逐帧渲染成视频。一个是生成式 AI，一个是程序化动画。</p>
        <div>不兜概念，我们直接拿例子来对比：</div>
        <div>· 同样是花朵生长的动画</div>
        <div>左边是可灵生成的，右边是用 Remotion 做的。你看花朵的形态、枝条的生长、随风摇曳的光影变化。Remotion 做的会生硬很多，因为它是通过代码参数控制不同图像的运动轨迹、缩放和透明度，来模拟枝条生长、花朵绽放的过程。</div>
      </div>
    </PreviewCard>}
    {time>=130.37&&previewOpacity>0&&<PreviewCard
      id="motion-library" top={136} height={230} target={{x:409,y:212}}
      enter={during(time,130.37,130.64)} collapse={during(time,131.63,132.06)} opacity={previewOpacity}
    >
      <p style={{margin:'0 0 16px'}}>这是我长期积累下来的「动效库」，Codex 里的项目对话是这样的。</p>
      <p style={{margin:'0 0 35px'}}>当我想直接复用某个动画效果，就直接在相应的对话里，继续提需求。或者，不想消耗 Codex 的额度了，换成其他 Agent，打开「动效库」的项目，也是一样的。</p>
      <div>长期积累下来，这个「动效库」就相当于自己的动画资产库。</div>
      <div>甚至，你还可以在这个基础上，搭建一个动画工作台。不过建议在自己的工作流程稳定成熟之后，再折腾工作台。不然一会搭、一会改，纯粹给自己添堵。</div>
      <Annotation progress={during(time,130.98,131.25)}>你可以自己模拟制作一个工作台的示意</Annotation>
    </PreviewCard>}
    {time>=132.14&&<>
      <div data-planning-example-label style={{position:'absolute',left:49,top:105,fontSize:9,letterSpacing:1,color:'#cc7254',opacity:during(time,132.24,132.64)}}>例如：对比三个模型能力那段</div>
      {compareAt===undefined?modelDocument:<ContentCollapse
        data-planning-document-collapse
        progress={during(compareAt,.06,.46)}
        to={{x:49-documentX*modelScale,y:modelY*(1-modelScale),scale:modelScale}}
      >{modelDocument}</ContentCollapse>}
    </>}
  </div>;
};
