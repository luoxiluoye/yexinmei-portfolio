import * as T from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {StudioSSAOPass as SSAOPass} from './studio-ssao';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {createWorkbench} from './model/workbench';
import type {ZoneId} from './model/atelier-geometry';
import {StudioDirector,type DirectorMilestone} from './studio-director';
import type {StudioState} from './studio-state';
const IDS:ZoneId[]=['writing','photography','aigc','video'];
const ACCENTS={writing:'#ed9c54',photography:'#65bafa',aigc:'#dfb53f',video:'#ee806b'};
const VERSION='studio-interactive-warm-final-20260924';
type Point={x:number;y:number};
type Telemetry={stats:{version:string;meshes:number;triangles:number;chair?:unknown};points:Record<string,Point>;frames:number;view:{yaw:number;pitch:number;dragging:boolean;camera:number[]};highlights:Record<string,{amount:number;emission:number;light:number}>;lighting:{pendantOn:boolean;color:string;intensity:number};studioState?:StudioState;director?:ReturnType<StudioDirector['debug']>;metrics?:{stage:string;averageFrameTime:number;p95FrameTime:number;estimatedFps:number;drawCalls:number;triangles:number;textures:number;gpuMemory:'unavailable'};metricsByStage?:Record<string,{stage:string;averageFrameTime:number;p95FrameTime:number;estimatedFps:number;drawCalls:number;triangles:number;textures:number;gpuMemory:'unavailable'}>};
declare global{interface Window{__STUDIO_QA__?:Telemetry;}}
/** Actual meshes, raycasting and bounded camera orbit. */
export class StudioExperience{
 readonly model:ReturnType<typeof createWorkbench>;
 private rig=new T.Group();private composer:EffectComposer;private ao:SSAOPass;private bloom:UnrealBloomPass;private output:OutputPass;
 private environment:T.WebGLRenderTarget;private previousEnvironment:T.Texture|null;private previousEnvironmentIntensity:number;
 private highlights={} as Record<ZoneId,{amount:number;rim:T.MeshBasicMaterial;halo:T.ShaderMaterial;light:T.PointLight;dot:T.MeshStandardMaterial}>;
 private pendantLights:T.Light[]=[];
 private disposed=false;private ready=false;private frames=0;private raf:number|null=null;private drive:number|null=null;private width=1;private height=1;private ratio=1;
 private yaw=0;private pitch=0;private requestedYaw=0;private requestedPitch=0;private hover:ZoneId|null=null;private selected:ZoneId|null=null;
 private studioState:StudioState={mode:'idle',phase:'stable'};private director:StudioDirector;private frameTimes:number[]=[];private lastStage='idle';
 private ray=new T.Raycaster();private pointer=new T.Vector2();private lookAt=new T.Vector3(0,2.23,.1);private desired=new T.Vector3();private castPoint=new T.Vector3();
 private down:{pointerId:number;x:number;y:number;yaw:number;pitch:number;zone:ZoneId|null;folderId:string|null;paperId:string|null;moved:boolean}|null=null;
 private reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;private qa=new URLSearchParams(window.location.search).get('qa')==='1';
 private motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');private previousCursor:string;private previousTouchAction:string;
 constructor(private gl:T.WebGLRenderer,private scene:T.Scene,private camera:T.PerspectiveCamera,images:T.Texture[],private invalidate:()=>void,private onSelect:(id:ZoneId)=>void,private onSelectFolder:(id:string)=>void,private onSelectInspect:(id:string)=>void,private onProjectNavigate:(delta:number)=>void,private onDirectorMilestone:(milestone:DirectorMilestone)=>void,private onReady:()=>void){
  this.model=createWorkbench(images);scene.add(this.model.root,this.rig);gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=.99;gl.outputColorSpace=T.SRGBColorSpace;
  gl.shadowMap.enabled=false;gl.shadowMap.type=T.PCFSoftShadowMap;if(this.qa)gl.setPixelRatio(.5);scene.background=new T.Color('#e9e4db');
  this.environment=new T.WebGLRenderTarget(1,1);
  this.previousEnvironment=scene.environment;this.previousEnvironmentIntensity=scene.environmentIntensity;scene.environment=null;scene.environmentIntensity=0;
  this.createLighting();this.createHighlights();
  this.composer=new EffectComposer(gl,new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:0}));const render=new RenderPass(scene,camera);
  this.ao=new SSAOPass(scene,camera,1,1,8);this.ao.kernelRadius=.12;this.ao.minDistance=.001;this.ao.maxDistance=.09;this.ao.enabled=false;
  this.bloom=new UnrealBloomPass(new T.Vector2(1,1),.055,.34,1.02);this.bloom.enabled=false;this.output=new OutputPass();this.composer.addPass(render);this.composer.addPass(this.ao);this.composer.addPass(this.bloom);this.composer.addPass(this.output);
  this.director=new StudioDirector(this.model,this.camera,()=>this.reduced,()=>({position:this.camera.position.clone(),quaternion:this.camera.quaternion.clone(),fov:this.camera.fov,orbit:{yaw:this.yaw,pitch:this.pitch,requestedYaw:this.requestedYaw,requestedPitch:this.requestedPitch}}),snapshot=>{this.camera.position.copy(snapshot.position);this.camera.quaternion.copy(snapshot.quaternion);this.camera.fov=snapshot.fov;this.camera.updateProjectionMatrix();if(snapshot.orbit){this.yaw=snapshot.orbit.yaw;this.pitch=snapshot.orbit.pitch;this.requestedYaw=snapshot.orbit.requestedYaw;this.requestedPitch=snapshot.orbit.requestedPitch;}},milestone=>this.onDirectorMilestone(milestone));
  const canvas=gl.domElement;this.previousCursor=canvas.style.cursor;this.previousTouchAction=canvas.style.touchAction;canvas.style.touchAction='none';canvas.style.cursor='grab';
  canvas.addEventListener('pointerdown',this.pointerDown);canvas.addEventListener('pointermove',this.pointerMove);canvas.addEventListener('pointerup',this.pointerUp);canvas.addEventListener('pointercancel',this.pointerCancel);canvas.addEventListener('pointerleave',this.pointerLeave);canvas.addEventListener('lostpointercapture',this.lostCapture);
  window.addEventListener('blur',this.pointerCancel);window.addEventListener('studio:reset',this.reset);window.addEventListener('keydown',this.keyDown,true);canvas.addEventListener('wheel',this.wheel,{passive:false});this.motionQuery.addEventListener('change',this.motionChange);
  if(this.qa){let meshes=0,triangles=0;this.model.root.traverse(o=>{if(o instanceof T.Mesh&&!o.userData.noBatch){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);}});window.__STUDIO_QA__={stats:{version:VERSION,meshes,triangles,chair:this.model.root.userData.chair},points:{},frames:0,view:{yaw:0,pitch:0,dragging:false,camera:[]},highlights:{},lighting:{pendantOn:true,color:'#ffd092',intensity:13}};window.addEventListener('studio:qa-pendant',this.qaPendant);window.addEventListener('studio:qa-progress',this.qaProgress);}
  this.invalidate();
 }
 private motionChange=(event:MediaQueryListEvent)=>{this.reduced=event.matches;this.invalidate();};
 private scheduleFrame=()=>{if(this.raf!==null)return;this.raf=window.requestAnimationFrame(()=>{this.raf=null;this.invalidate();});};
 private keyDown=(event:KeyboardEvent)=>{if(this.studioState.mode==='project'&&(event.key==='ArrowRight'||event.key==='ArrowLeft')){event.preventDefault();this.onProjectNavigate(event.key==='ArrowRight'?1:-1);this.invalidate();}};
 private wheel=(event:WheelEvent)=>{if(this.studioState.mode==='project'&&Math.abs(event.deltaX+event.deltaY)>3){event.preventDefault();this.onProjectNavigate((event.deltaX||event.deltaY)>0?1:-1);this.invalidate();}};
 private createLighting(){
  const add=(light:T.Light,pos?:[number,number,number])=>{if(pos)light.position.set(...pos);this.rig.add(light);return light;};
  add(new T.AmbientLight('#fff0db',.18));add(new T.HemisphereLight('#f9f0e5','#b6a38d',.38));
  const key=new T.DirectionalLight('#fff4e4',1.32);add(key,[-3.8,8,6]);key.castShadow=false;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-8,right:8,top:8,bottom:-5,near:.1,far:26});key.shadow.bias=-.00005;key.shadow.normalBias=.015;
  add(new T.DirectionalLight('#d6e7f4',.27),[5,3,5]);
  const spot=(pos:[number,number,number],target:[number,number,number],power:number,angle:number)=>{const light=new T.SpotLight('#ffd092',power,12,angle,.92,2);light.position.set(...pos);light.target.position.set(...target);this.rig.add(light,light.target);this.pendantLights.push(light);return light;};
  // Broad warm wash on the board; a separate downward source illuminates the desk.
  spot([0,5.30,.26],[0,1.40,-.64],13,.66);spot([0,5.295,.29],[0,0,.79],34,.47);
  const spill=new T.PointLight('#ffd7a3',.08,2.7,2);add(spill,[0,5.30,.26]);this.pendantLights.push(spill);
  add(new T.PointLight('#ffd69b',2.25,3.5,2),[-4.98,1.42,.81]);add(new T.PointLight('#ffe3ae',.35,1.3,2),[-2.95,2.4,.2]);
  for(const material of this.model.geometry.materials){if(material instanceof T.MeshStandardMaterial&&material.emissiveIntensity===1.4){material.color.set('#ffdb9e');material.emissive.set('#ffcf8a');material.emissiveIntensity=2.0;material.needsUpdate=true;}}
  const sun=this.model.root.getObjectByName('Filtered window light');if(sun instanceof T.SpotLight)sun.intensity=14;
 }
 private createHighlights(){
  const d=this.model.geometry;
  for(const id of IDS){
   const zone=this.model.zones[id],params=(zone.hit.geometry as T.BoxGeometry).parameters,w=params.width,h=params.height;
   const rim=new T.MeshBasicMaterial({color:ACCENTS[id],transparent:true,opacity:0,depthWrite:false,toneMapped:false});d.materials.add(rim);
   const frame=d.frame(zone.group,[0,0,.36],w+.04,h+.04,.015,.030,rim,.16);frame.castShadow=false;frame.userData.noBatch=true;
   const halo=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,
    uniforms:{accent:{value:new T.Color(ACCENTS[id])},extent:{value:new T.Vector2(w/2,h/2)},strength:{value:0},size:{value:new T.Vector2(w+.6,h+.6)}},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'varying vec2 vUv; uniform vec3 accent; uniform vec2 extent; uniform vec2 size; uniform float strength; void main(){vec2 p=(vUv-0.5)*size; vec2 q=abs(p)-extent+vec2(0.16); float dist=length(max(q,0.0))+min(max(q.x,q.y),0.0)-0.16; float glow=exp(-abs(dist)*19.0)*0.45; gl_FragColor=vec4(accent*1.5,glow*strength);}'
   });d.materials.add(halo);
   const haloMesh=d.mesh(zone.group,d.own(new T.PlaneGeometry(w+.6,h+.6)),halo,[0,0,.35]);haloMesh.castShadow=false;haloMesh.userData.noBatch=true;
   const dot=d.mat(ACCENTS[id],.3,0,{emissive:ACCENTS[id],emissiveIntensity:.65,toneMapped:false});const ring=d.torus(zone.group,[-w/2+.17,h/2-.17,.40],.075,.014,dot);ring.castShadow=false;ring.userData.noBatch=true;
   const light=new T.PointLight(ACCENTS[id],0,3.7,2);light.position.set(0,0,.96);zone.group.add(light);this.highlights[id]={amount:0,rim,halo,light,dot};
  }
 }
 setSize(width:number,height:number){if(this.disposed)return;this.width=width;this.height=height;this.ratio=width/Math.max(height,1);this.composer.setPixelRatio(this.gl.getPixelRatio());this.composer.setSize(width,height);this.ao.enabled=this.studioState.mode==='idle'&&width>=700;this.invalidate();}
 setSelected(id:ZoneId|null){if(this.studioState.mode==='idle')this.selected=id;this.invalidate();}
 setStudioState(state:StudioState){this.studioState=state;if(state.mode!=='idle')this.selected='aigc';else this.selected=null;this.director.setState(state);this.ao.enabled=state.mode==='idle'&&this.width>=700;this.bloom.strength=state.mode==='idle'?.055:.025;if(state.mode!=='idle'&&this.drive===null)this.drive=window.setInterval(()=>this.invalidate(),16);if(state.mode==='idle'&&this.drive!==null){window.clearInterval(this.drive);this.drive=null;}this.invalidate();}
 private interactionLocked(){return this.studioState.mode==='focus'||this.studioState.mode==='inspect'||(this.studioState.mode==='idle'&&Boolean(this.selected));}
 private pointerRay(clientX:number,clientY:number){const box=this.gl.domElement.getBoundingClientRect();this.pointer.set((clientX-box.left)/box.width*2-1,-(clientY-box.top)/box.height*2+1);this.camera.updateMatrixWorld();this.model.root.updateMatrixWorld(true);this.ray.setFromCamera(this.pointer,this.camera);}
 private pick(clientX:number,clientY:number):ZoneId|null{this.pointerRay(clientX,clientY);const hits=this.ray.intersectObjects(IDS.map(id=>this.model.zones[id].hit),false);return hits.length?(hits[0].object.userData.zone as ZoneId):null;}
 private pickFolder(clientX:number,clientY:number):string|null{if(this.studioState.mode!=='collection')return null;this.pointerRay(clientX,clientY);const hits=this.ray.intersectObjects([this.model.aigc.folders['red-leaf'].hit,this.model.aigc.folders.social.hit],false);return hits.length?(hits[0].object.userData.aigcFolder as string):null;}
 private pickPaper(clientX:number,clientY:number):string|null{if(this.studioState.mode!=='project')return null;this.pointerRay(clientX,clientY);const papers=this.model.aigc.folders['red-leaf'].papers;const hits=this.ray.intersectObjects(papers.flatMap(p=>p.root.children.filter((o):o is T.Mesh=>o instanceof T.Mesh)),true);for(const hit of hits){let node:T.Object3D|null=hit.object;while(node&& !node.userData.aigcItem)node=node.parent; if(node?.userData.aigcItem)return String(node.userData.aigcItem);}return null;}
 private setHover(id:ZoneId|null){if(id===this.hover)return;this.hover=id;if(id)document.documentElement.dataset.studioHover=id;else delete document.documentElement.dataset.studioHover;if(!this.down?.moved)this.gl.domElement.style.cursor=id?'pointer':'grab';this.invalidate();}
 private pointerDown=(event:PointerEvent)=>{if(this.interactionLocked()||event.button!==0||!event.isPrimary||this.down)return;event.preventDefault();this.down={pointerId:event.pointerId,x:event.clientX,y:event.clientY,yaw:this.requestedYaw,pitch:this.requestedPitch,zone:this.pick(event.clientX,event.clientY),folderId:this.pickFolder(event.clientX,event.clientY),paperId:this.pickPaper(event.clientX,event.clientY),moved:false};this.gl.domElement.setPointerCapture(event.pointerId);};
 private pointerMove=(event:PointerEvent)=>{
  if(this.studioState.mode==='focus'||this.studioState.mode==='inspect'||(this.studioState.mode==='idle'&&this.selected))return;
  if(this.down){if(event.pointerId!==this.down.pointerId)return;const dx=event.clientX-this.down.x,dy=event.clientY-this.down.y;if(Math.hypot(dx,dy)>6)this.down.moved=true;if(this.down.moved){this.requestedYaw=T.MathUtils.clamp(this.down.yaw-dx/Math.max(this.width,390)*.85,-.19,.19);this.requestedPitch=T.MathUtils.clamp(this.down.pitch+dy/Math.max(this.height,500)*.24,-.028,.065);this.setHover(null);this.gl.domElement.style.cursor='grabbing';document.documentElement.dataset.studioDragging='true';this.invalidate();}}
  else this.setHover(this.pick(event.clientX,event.clientY));
 };
 private pointerUp=(event:PointerEvent)=>{
  const down=this.down;if(!down||event.pointerId!==down.pointerId)return;
  // A drag suppresses navigation for this gesture only, never for the following click.
  const dx=event.clientX-down.x, moved=down.moved||Math.hypot(dx,event.clientY-down.y)>6,upZone=this.pick(event.clientX,event.clientY),upFolder=this.pickFolder(event.clientX,event.clientY),upPaper=this.pickPaper(event.clientX,event.clientY);this.down=null;delete document.documentElement.dataset.studioDragging;
  if(this.gl.domElement.hasPointerCapture(event.pointerId))this.gl.domElement.releasePointerCapture(event.pointerId);
  this.setHover(event.pointerType==='touch'?null:upZone);this.gl.domElement.style.cursor=this.hover||upFolder?'pointer':'grab';if(this.studioState.mode==='project'&&moved&&Math.abs(dx)>18){this.onProjectNavigate(dx<0?1:-1);}else if(!moved&&upPaper&&upPaper===down.paperId&&this.studioState.mode==='project'){this.onSelectInspect(upPaper);}else if(!moved&&upFolder&&upFolder===down.folderId){this.onSelectFolder(upFolder);}else if(!moved&&upZone&&upZone===down.zone&&this.studioState.mode==='idle'){this.selected=upZone;this.onSelect(upZone);}this.invalidate();
 };
 private pointerCancel=()=>{const down=this.down;this.down=null;delete document.documentElement.dataset.studioDragging;if(down&&this.gl.domElement.hasPointerCapture(down.pointerId))this.gl.domElement.releasePointerCapture(down.pointerId);this.setHover(null);this.gl.domElement.style.cursor='grab';this.invalidate();};
 private pointerLeave=()=>{if(!this.down)this.setHover(null);};private lostCapture=()=>{if(this.down)this.pointerCancel();};
 reset=()=>{if(this.selected||this.studioState.mode!=='idle')return;this.requestedYaw=0;this.requestedPitch=0;this.setHover(null);this.invalidate();};
 private qaPendant=(event:Event)=>{const on=(event as CustomEvent<boolean>).detail;this.pendantLights.forEach(light=>light.visible=on);if(window.__STUDIO_QA__)window.__STUDIO_QA__.lighting.pendantOn=on;this.invalidate();};
 private qaProgress=(event:Event)=>{if(!this.qa)return;const value=Number((event as CustomEvent<number>).detail);if(Number.isFinite(value)){this.director.setDebugProgress(value);this.invalidate();}};
 render(delta:number){
  if(this.disposed)return;const dt=T.MathUtils.clamp(delta,.016,.15),blend=this.reduced?1:1-Math.exp(-10*dt);const directorActive=this.director.isActive;
  let animating=false;
  const dynamic=this.studioState.mode!=='idle'||this.studioState.phase==='leaving';this.ao.enabled=!dynamic&&this.width>=700;this.bloom.strength=dynamic?.025:.055;
  if(directorActive){animating=this.director.tick(dt);}else{
   this.yaw+=(this.requestedYaw-this.yaw)*blend;this.pitch+=(this.requestedPitch-this.pitch)*blend;
   const anchor=this.selected?this.model.zones[this.selected].anchor:null,fx=anchor?anchor.x*.23:0,fy=anchor?2.23+(anchor.y-2.23)*.23:2.23,radius=17.3*Math.max(1,1.60/this.ratio)-(this.selected ? .65 : 0);this.lookAt.set(fx,fy,.1);
   this.desired.set(fx+Math.sin(this.yaw)*radius,fy+1.52+Math.sin(this.pitch)*radius,.1+Math.cos(this.yaw)*radius);this.camera.position.lerp(this.desired,blend);this.camera.lookAt(this.lookAt);this.camera.updateMatrixWorld();
   animating=this.frames<6||this.camera.position.distanceToSquared(this.desired)>.000005||Math.abs(this.yaw-this.requestedYaw)>.00008||Math.abs(this.pitch-this.requestedPitch)>.00008;
  }
  for(const id of IDS){const zone=this.model.zones[id],h=this.highlights[id],active=id===(this.selected??this.hover),goal=active?1:0;h.amount+=(goal-h.amount)*blend;if(Math.abs(goal-h.amount)>.003)animating=true;h.rim.opacity=.90*h.amount;h.halo.uniforms.strength.value=.95*h.amount;h.light.intensity=2.1*h.amount;h.dot.emissiveIntensity=.65+2.4*h.amount;zone.glow.emissive.set(active?ACCENTS[id]:'#ffdec0');zone.glow.emissiveIntensity=.38+2.3*h.amount;zone.hit.visible=false;}
  const folderHit=this.model.aigc.folders['red-leaf'].hit;folderHit.visible=false;
  const frameStart=performance.now();try{this.gl.render(this.scene,this.camera);}finally{IDS.forEach(id=>this.model.zones[id].hit.visible=true);folderHit.visible=true;}this.frames++;const frameTime=performance.now()-frameStart;this.frameTimes.push(frameTime);if(this.frameTimes.length>180)this.frameTimes.shift();
  const telemetry=window.__STUDIO_QA__;if(this.qa&&telemetry){telemetry.frames=this.frames;telemetry.view={yaw:this.yaw,pitch:this.pitch,dragging:!!this.down?.moved,camera:this.camera.position.toArray()};telemetry.studioState=this.studioState;telemetry.director=this.director.debug();const samples=(this.frameTimes.length>8?this.frameTimes.slice(6):this.frameTimes).filter(value=>value<200),sorted=[...samples].sort((a,b)=>a-b),average=samples.reduce((a,b)=>a+b,0)/Math.max(1,samples.length),p95=sorted[Math.floor(Math.max(0,sorted.length-1)*.95)]??average;const stage=this.studioState.phase==='leaving'?'returning':this.studioState.mode==='idle'?'idle':this.studioState.mode==='focus'?'focus-transition':this.studioState.mode==='collection'?'collection':this.studioState.mode==='project'?(this.studioState.phase==='entering'?'folder-opening':'project-browsing'):'inspect';const metrics={stage,averageFrameTime:average,p95FrameTime:p95,estimatedFps:1000/Math.max(p95,1),drawCalls:this.gl.info.render.calls,triangles:this.gl.info.render.triangles,textures:this.gl.info.memory.textures,gpuMemory:'unavailable' as const};telemetry.metrics=metrics;telemetry.metricsByStage={...(telemetry.metricsByStage??{}),[stage]:metrics};const rect=this.gl.domElement.getBoundingClientRect();this.model.root.updateMatrixWorld(true);for(const id of IDS){this.castPoint.copy(this.model.zones[id].anchor).project(this.camera);telemetry.points[id]={x:rect.left+(this.castPoint.x*.5+.5)*rect.width,y:rect.top+(-this.castPoint.y*.5+.5)*rect.height};const h=this.highlights[id];telemetry.highlights[id]={amount:h.amount,emission:this.model.zones[id].glow.emissiveIntensity,light:h.light.intensity};}for(const [key,folder] of Object.entries(this.model.aigc.folders)){folder.root.getWorldPosition(this.castPoint);this.castPoint.project(this.camera);telemetry.points[`aigc-${key}`]={x:rect.left+(this.castPoint.x*.5+.5)*rect.width,y:rect.top+(-this.castPoint.y*.5+.5)*rect.height};folder.papers.forEach((paper,index)=>{paper.root.getWorldPosition(this.castPoint);this.castPoint.project(this.camera);telemetry.points[`aigc-paper-${index}`]={x:rect.left+(this.castPoint.x*.5+.5)*rect.width,y:rect.top+(-this.castPoint.y*.5+.5)*rect.height};});}}
  if(!this.ready&&this.frames>=6){this.ready=true;document.documentElement.dataset.studioReady='true';this.onReady();}if(animating){this.invalidate();this.scheduleFrame();}else if(this.studioState.mode==='idle'&&this.drive!==null){window.clearInterval(this.drive);this.drive=null;}
 }
 dispose(){
  if(this.disposed)return;this.disposed=true;if(this.raf!==null){window.cancelAnimationFrame(this.raf);this.raf=null;}if(this.drive!==null){window.clearInterval(this.drive);this.drive=null;}const canvas=this.gl.domElement;
  canvas.removeEventListener('pointerdown',this.pointerDown);canvas.removeEventListener('pointermove',this.pointerMove);canvas.removeEventListener('pointerup',this.pointerUp);canvas.removeEventListener('pointercancel',this.pointerCancel);canvas.removeEventListener('pointerleave',this.pointerLeave);canvas.removeEventListener('lostpointercapture',this.lostCapture);
  window.removeEventListener('blur',this.pointerCancel);window.removeEventListener('studio:reset',this.reset);window.removeEventListener('keydown',this.keyDown,true);this.gl.domElement.removeEventListener('wheel',this.wheel);window.removeEventListener('studio:qa-pendant',this.qaPendant);window.removeEventListener('studio:qa-progress',this.qaProgress);this.motionQuery.removeEventListener('change',this.motionChange);
  canvas.style.cursor=this.previousCursor;canvas.style.touchAction=this.previousTouchAction;this.scene.remove(this.model.root,this.rig);this.scene.environment=this.previousEnvironment;this.scene.environmentIntensity=this.previousEnvironmentIntensity;
  this.rig.traverse(o=>{if(o instanceof T.Light&&'shadow' in o)(o as T.DirectionalLight).shadow?.dispose();});this.ao.dispose();this.bloom.dispose();this.output.dispose();this.composer.dispose();this.environment.dispose();this.model.dispose();
  delete document.documentElement.dataset.studioReady;delete document.documentElement.dataset.studioHover;delete document.documentElement.dataset.studioDragging;if(this.qa)delete window.__STUDIO_QA__;
 }
}
