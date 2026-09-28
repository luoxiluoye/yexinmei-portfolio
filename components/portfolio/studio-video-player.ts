import * as T from 'three';
import {STUDIO_VIDEO} from './studio-content';
export type VideoStatus={active:boolean;clipIndex:number;playing:boolean;muted:boolean;time:number;duration:number;status:'ready'|'loading'|'playing'|'paused'|'ended'|'error';decodedFrames:number};
export type VideoCommand={action:'toggle'|'mute'|'seek'|'select'|'retry'|'query';value?:number};
export const INITIAL_VIDEO_STATUS:VideoStatus={active:false,clipIndex:0,playing:false,muted:false,time:0,duration:STUDIO_VIDEO.clips[0].duration,status:'ready',decodedFrames:0};
/** Video is a texture on the existing TV, not another page or rendering surface. */
export class StudioVideoPlayer{
 private video:HTMLVideoElement|null=null;private texture:T.VideoTexture|null=null;private callback:number|null=null;private fallback:number|null=null;
 private state:VideoStatus={...INITIAL_VIDEO_STATUS};private disposed=false;private generation=0;
 private poster:T.Texture|null;private posterScale:T.Vector3;
 constructor(private surface:T.Mesh,private invalidate:()=>void){this.poster=(surface.material as T.MeshBasicMaterial).map;this.posterScale=surface.scale.clone();window.addEventListener('studio:video-command',this.command);document.addEventListener('visibilitychange',this.visibility);}
 private notify(){window.dispatchEvent(new CustomEvent('studio:video-status',{detail:{...this.state}}));}
 private command=(event:Event)=>{const {action,value}=(event as CustomEvent<VideoCommand>).detail;
  if(action==='query'){this.notify();return;}if(!this.state.active)return;
  if(action==='toggle'){if(this.video&&!this.video.paused)this.video.pause();else this.play();}
  if(action==='retry'){this.release();this.play();}
  if(action==='mute'){this.state.muted=!this.state.muted;if(this.video)this.video.muted=this.state.muted;this.notify();}
  if(action==='seek'&&this.video&&Number.isFinite(value)&&Number.isFinite(this.video.duration)){this.video.currentTime=T.MathUtils.clamp(value!,0,this.video.duration);this.invalidate();}
  if(action==='select'&&Number.isInteger(value)&&value!>=0&&value!<STUDIO_VIDEO.clips.length&&value!==this.state.clipIndex){const resume=Boolean(this.video&&!this.video.paused&&!this.video.ended);this.release();this.state.clipIndex=value!;this.state.duration=STUDIO_VIDEO.clips[value!].duration;this.state.status='ready';this.notify();if(resume)this.play();}
 };
 setActive(active:boolean){if(active===this.state.active)return;this.state.active=active;if(!active){this.release();this.state.status='ready';}this.notify();}
 toggle(){this.command(new CustomEvent('studio:video-command',{detail:{action:'toggle'}}));}
 private visibility=()=>{if(document.hidden)this.video?.pause();};
 private ensure(){if(this.video)return this.video;
  const video=document.createElement('video');this.video=video;video.preload='none';video.playsInline=true;video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.muted=this.state.muted;video.crossOrigin='anonymous';
  video.setAttribute('aria-hidden','true');video.tabIndex=-1;Object.assign(video.style,{position:'fixed',width:'1px',height:'1px',opacity:'0',pointerEvents:'none',bottom:'0',left:'0'});document.body.appendChild(video);
  const live=()=>!this.disposed&&this.video===video;
  video.addEventListener('loadedmetadata',()=>{if(!live())return;this.state.duration=video.duration;this.notify();});
  video.addEventListener('loadeddata',()=>{if(!live())return;this.showFrame();this.invalidate();});
  video.addEventListener('playing',()=>{if(!live())return;this.state.playing=true;this.state.status='playing';this.showFrame();this.schedule();this.notify();});
  video.addEventListener('waiting',()=>{if(!live())return;this.state.status='loading';this.notify();});
  video.addEventListener('pause',()=>{if(!live())return;this.state.playing=false;this.state.status=video.error||this.state.status==='error'?'error':video.ended?'ended':'paused';this.cancel();this.update();this.invalidate();});
  video.addEventListener('ended',()=>{if(!live())return;this.state.playing=false;this.state.status='ended';this.cancel();this.update();this.invalidate();});
  video.addEventListener('seeked',()=>{if(!live())return;this.showFrame();this.update();this.invalidate();});
  video.addEventListener('timeupdate',()=>{if(live())this.update();});
  video.addEventListener('error',()=>{if(!live())return;this.state.playing=false;this.state.status='error';this.cancel();this.notify();this.invalidate();});
  video.src=STUDIO_VIDEO.clips[this.state.clipIndex].src;return video;
 }
 private showFrame(){if(!this.video||this.video.readyState<2)return;if(!this.texture){this.texture=new T.VideoTexture(this.video);this.texture.colorSpace=T.SRGBColorSpace;this.texture.generateMipmaps=false;this.texture.minFilter=T.LinearFilter;this.texture.magFilter=T.LinearFilter;}
  this.texture.needsUpdate=true;const material=this.surface.material as T.MeshBasicMaterial;material.map=this.texture;material.needsUpdate=true;
  const aspect=this.video.videoWidth/this.video.videoHeight,screenAspect=1.84/1.04;this.surface.scale.set(Math.min(1,aspect/screenAspect),Math.min(1,screenAspect/aspect),1);
 }
 private play(){const video=this.ensure(),generation=this.generation;if(video.ended)video.currentTime=0;this.state.status='loading';this.notify();video.play().catch(()=>{if(this.disposed||this.video!==video||generation!==this.generation)return;this.state.playing=false;this.state.status='error';this.notify();});}
 private update(){if(!this.video)return;this.state.time=this.video.currentTime;this.state.decodedFrames=this.video.getVideoPlaybackQuality?.().totalVideoFrames??0;this.notify();}
 private schedule(){if(!this.video||this.video.paused||!this.state.active||this.callback!==null||this.fallback!==null)return;
  if('requestVideoFrameCallback' in this.video){this.callback=this.video.requestVideoFrameCallback(()=>{this.callback=null;if(this.disposed||!this.state.active)return;this.invalidate();this.schedule();});}
  else this.fallback=window.requestAnimationFrame(()=>{this.fallback=null;if(this.disposed||!this.state.active)return;this.invalidate();this.schedule();});
 }
 private cancel(){if(this.callback!==null&&this.video)this.video.cancelVideoFrameCallback(this.callback);if(this.fallback!==null)cancelAnimationFrame(this.fallback);this.callback=null;this.fallback=null;}
 private release(){this.generation++;this.cancel();const video=this.video;this.video=null;if(video){video.pause();video.removeAttribute('src');video.load();video.remove();}this.texture?.dispose();this.texture=null;const material=this.surface.material as T.MeshBasicMaterial;material.map=this.poster;material.needsUpdate=true;this.surface.scale.copy(this.posterScale);this.state.playing=false;this.state.time=0;this.state.decodedFrames=0;this.invalidate();}
 debug(){return {...this.state,screenUUID:this.surface.uuid,source:this.video?.currentSrc??'',videoWidth:this.video?.videoWidth??0,videoHeight:this.video?.videoHeight??0,textureUUID:this.texture?.uuid??null};}
 dispose(){this.disposed=true;window.removeEventListener('studio:video-command',this.command);document.removeEventListener('visibilitychange',this.visibility);this.release();}
}
