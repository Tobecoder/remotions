import {useCallback, useEffect, useRef, useState} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {MaterialDemo} from './MaterialDemo';
import type {CatalogItem} from './catalog';

export const MaterialCard=({item}:{item:CatalogItem})=>{
  const player=useRef<PlayerRef>(null);
  const lastPointer=useRef<string|null>(null);
  const [playing,setPlaying]=useState(false);
  const stop=useCallback(()=>{player.current?.pause();player.current?.seekTo(item.posterFrame);setPlaying(false);},[item.posterFrame]);
  const start=()=>{player.current?.seekTo(0);player.current?.play();setPlaying(true);};
  useEffect(()=>{
    const current=player.current;
    const ended=()=>setPlaying(false);
    current?.addEventListener('ended',ended);
    return ()=>current?.removeEventListener('ended',ended);
  },[]);
  return <article className="material-card" data-material-id={item.id}>
    <button type="button" className="material-preview" aria-label={`${item.name}：${playing?'停止预览':'播放预览'}`} aria-pressed={playing}
      onPointerEnter={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')start();}}
      onPointerLeave={event=>{if(event.pointerType!=='touch'){lastPointer.current=null;stop();}}}
      onPointerDown={event=>{lastPointer.current=event.pointerType;}}
      onPointerCancel={()=>{lastPointer.current=null;stop();}}
      onFocus={()=>{if(lastPointer.current===null)start();}}
      onBlur={()=>{lastPointer.current=null;stop();}}
      onClick={()=>{if(playing)stop();else start();lastPointer.current=null;}}>
      <Player ref={player} component={MaterialDemo} inputProps={{id:item.id}} compositionWidth={800} compositionHeight={450} durationInFrames={item.durationInFrames} fps={30} initialFrame={item.posterFrame} controls={false} autoPlay={false} loop={false} initiallyMuted moveToBeginningWhenEnded={false} clickToPlay={false} doubleClickToFullscreen={false} style={{width:'100%',aspectRatio:'16 / 9',pointerEvents:'none'}}/>
    </button>
    <div className="material-body"><div className="material-title"><h3>{item.name}</h3><span>{item.usage}</span></div><p>{item.description}</p><details className="material-code"><summary>查看用法</summary><pre><code>{item.code}</code></pre></details></div>
  </article>;
};
