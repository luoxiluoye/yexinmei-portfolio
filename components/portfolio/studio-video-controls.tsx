'use client';
import {useEffect,useState} from 'react';
import {STUDIO_VIDEO} from './studio-content';
import {INITIAL_VIDEO_STATUS,type VideoCommand,type VideoStatus} from './studio-video-player';
const clock=(value:number)=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
const command=(detail:VideoCommand)=>window.dispatchEvent(new CustomEvent('studio:video-command',{detail}));
export function StudioVideoControls(){
 const [state,setState]=useState<VideoStatus>(INITIAL_VIDEO_STATUS);
 useEffect(()=>{const update=(event:Event)=>setState((event as CustomEvent<VideoStatus>).detail);window.addEventListener('studio:video-status',update);command({action:'query'});return()=>window.removeEventListener('studio:video-status',update);},[]);
 return <section className='studio-aigc-hud studio-video-hud' aria-label='电视播放控制'>
  <div className='studio-video-heading'><label>周家刀 <select aria-label='选择周家刀视频' value={state.clipIndex} onChange={event=>command({action:'select',value:Number(event.target.value)})}>{STUDIO_VIDEO.clips.map((clip,index)=><option key={clip.src} value={index}>{String(index+1).padStart(2,'0')} · {clip.title}</option>)}</select></label><a href={STUDIO_VIDEO.href} target='_blank' rel='noopener noreferrer'>相关报道 ↗</a></div>
  <div className='studio-video-transport'>
   <button type='button' aria-label={state.status==='error'?'重试播放':state.playing?'暂停视频':state.status==='ended'?'重新播放':'播放视频'} onClick={()=>command({action:state.status==='error'?'retry':'toggle'})}>{state.playing?'Ⅱ':'▶'}</button>
   <input type='range' min='0' max={state.duration} step='.1' value={state.time} disabled={state.status==='ready'||state.status==='error'} aria-label='视频播放进度' aria-valuetext={`${clock(state.time)}，共 ${clock(state.duration)}`} onChange={event=>command({action:'seek',value:Number(event.target.value)})}/>
   <span className='studio-video-time'>{clock(state.time)} / {clock(state.duration)}</span>
   <button className='studio-video-sound' type='button' aria-label={state.muted?'开启声音':'静音'} onClick={()=>command({action:'mute'})}>{state.muted?'静音':'声音'}</button>
  </div>
  <span className='studio-video-status' role='status'>{state.status==='error'?'视频未能播放，请点击播放按钮重试':state.status==='loading'?'正在载入视频…':state.status==='ready'?'点击播放，或直接点击电视屏幕':state.status==='ended'?'播放结束':state.playing?'正在播放 · 1080p':'已暂停'}</span>
 </section>;
}
