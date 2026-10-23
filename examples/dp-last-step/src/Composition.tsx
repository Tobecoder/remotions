import {Audio} from '@remotion/media';
import {staticFile,useVideoConfig} from 'remotion';
import Scene from './Scene';

export const Sample=()=>{
  const {fps}=useVideoConfig();
  return <><Scene/><Audio src={staticFile('audio/narration.wav')} premountFor={fps}/></>;
};
