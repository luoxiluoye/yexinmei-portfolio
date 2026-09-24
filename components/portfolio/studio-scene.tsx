'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {SoftShadows,useTexture} from '@react-three/drei';
import * as T from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {SSAOPass} from 'three/examples/jsm/postprocessing/SSAOPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {createWorkbench,WORK_IMAGES} from './model/workbench';
import type {ZoneId} from './model/atelier-geometry';
export type PortfolioZoneId=ZoneId;
declare global {interface Window{__STUDIO_QA__?:{stats:{meshes:number;triangles:number;version:string;chair?:unknown};points:Record<string,{x:number;y:number}>;frames:number};}}
export function StudioScene({onSelect,selected=null,onReady}:{onSelect:(id:ZoneId)=>void;selected?:ZoneId|null;onReady?:()=>void}){
 const images=useTexture(WORK_IMAGES),model=useMemo(()=>createWorkbench(images),[images]);
 const {gl,scene,camera,size,invalidate}=useThree();
 const hovered=useRef<ZoneId|null>(null),ready=useRef(false),frames=useRef(0),reduced=useRef(false),qa=useRef(false);
 const target=useRef(new T.Vector3(0,2.23,.1));
 const lampTarget=useMemo(()=>{const t=new T.Object3D();t.position.set(0,1.7,-.4);return t;},[]);
 const colors:Record<ZoneId,T.Color>=useMemo(()=>({writing:new T.Color('#ffc6a0'),photography:new T.Color('#a5d4ff'),aigc:new T.Color('#ffe0a4'),video:new T.Color('#ffa5a1')}),[]);
 const idleColor=useMemo(()=>new T.Color('#ffead1'),[]);
 useEffect(()=>{
  reduced.current=window.matchMedia('(prefers-reduced-motion: reduce)').matches;qa.current=new URLSearchParams(window.location.search).get('qa')==='1';
  gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=1.0;gl.outputColorSpace=T.SRGBColorSpace;
  const pmrem=new T.PMREMGenerator(gl),room=new RoomEnvironment(),env=pmrem.fromScene(room,.045),previous=scene.environment;
  scene.environment=env.texture;scene.environmentIntensity=.38;room.dispose();pmrem.dispose();
  let meshes=0,triangles=0;model.root.traverse(o=>{if(o instanceof T.Mesh&&!o.userData.noBatch){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);}});
  if(qa.current)window.__STUDIO_QA__={stats:{meshes,triangles,version:'atelier-refined-chair-back-20260924',chair:model.root.userData.chair},points:{},frames:0};
  invalidate();return()=>{scene.environment=previous;env.dispose();document.body.style.cursor='';delete document.documentElement.dataset.studioReady;delete document.documentElement.dataset.studioHover;delete window.__STUDIO_QA__;};
 },[gl,scene,model,invalidate]);
 useEffect(()=>()=>model.dispose(),[model]);
 const post=useMemo(()=>{
  const composer=new EffectComposer(gl,new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:4}));
  const render=new RenderPass(scene,camera),ao=new SSAOPass(scene,camera,1,1,16);ao.kernelRadius=.19;ao.minDistance=.001;ao.maxDistance=.12;
  const bloom=new UnrealBloomPass(new T.Vector2(1,1),.16,.40,1),output=new OutputPass();
  composer.addPass(render);composer.addPass(ao);composer.addPass(bloom);composer.addPass(output);return {composer,ao,bloom,output};
 },[gl,scene,camera]);
 useEffect(()=>{post.composer.setPixelRatio(gl.getPixelRatio());post.composer.setSize(size.width,size.height);post.ao.enabled=size.width>=700;invalidate();},[post,size,gl,invalidate]);
 useEffect(()=>()=>{post.ao.dispose();post.bloom.dispose();post.output.dispose();post.composer.dispose();},[post]);
 function zoneOf(object:T.Object3D):ZoneId|null{for(let n:T.Object3D|null=object;n;n=n.parent)if(n.userData.zone)return n.userData.zone as ZoneId;return null;}
 function move(event:ThreeEvent<PointerEvent>){const id=zoneOf(event.object);if(id){event.stopPropagation();hovered.current=id;document.body.style.cursor='pointer';document.documentElement.dataset.studioHover=id;invalidate();}}
 function leave(){hovered.current=null;document.body.style.cursor='';delete document.documentElement.dataset.studioHover;invalidate();}
 function click(event:ThreeEvent<MouseEvent>){const id=zoneOf(event.object);if(id){event.stopPropagation();onSelect(id);invalidate();}}
 useFrame((_,delta)=>{
  const dt=Math.min(delta,.20),aspect=size.width/Math.max(1,size.height),distance=17.4*Math.max(1,1.60/aspect),anchor=selected?model.zones[selected].anchor:null;
  const fx=anchor?anchor.x*.25:0,fy=anchor?2.23+(anchor.y-2.23)*.25:2.23;
  const desired=new T.Vector3(fx,fy+1.52,distance-(selected?.7:0));
  let animating=frames.current<6||camera.position.distanceToSquared(desired)>.000004;
  if(reduced.current)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-8*dt));target.current.set(fx,fy,.1);camera.lookAt(target.current);
  for(const [id,z] of Object.entries(model.zones)){const active=id===(selected||hovered.current),strength=active?2.5:.42;if(Math.abs(z.glow.emissiveIntensity-strength)>.012)animating=true;z.glow.emissive.lerp(active?colors[id as ZoneId]:idleColor,1-Math.exp(-14*dt));z.glow.emissiveIntensity=reduced.current?strength:T.MathUtils.damp(z.glow.emissiveIntensity,strength,14,dt);z.hit.visible=false;}
  post.composer.render(dt);for(const z of Object.values(model.zones))z.hit.visible=true;frames.current++;
  if(qa.current&&window.__STUDIO_QA__){const rect=gl.domElement.getBoundingClientRect();window.__STUDIO_QA__.frames=frames.current;for(const [id,z] of Object.entries(model.zones)){const q=z.anchor.clone().project(camera);window.__STUDIO_QA__.points[id]={x:rect.left+(q.x*.5+.5)*rect.width,y:rect.top+(-q.y*.5+.5)*rect.height};}}
  if(frames.current>5&&!ready.current){ready.current=true;document.documentElement.dataset.studioReady='true';onReady?.();}if(animating)invalidate();
 },1);
 return <>
  <color attach='background' args={['#edeae4']}/><ambientLight intensity={.22} color='#fff2de'/><hemisphereLight intensity={.5} color='#f1f5ff' groundColor='#b2a38e'/>
  <directionalLight position={[-3.8,8,6]} intensity={2.05} color='#fff1da' castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-camera-near={.1} shadow-camera-far={26} shadow-bias={-.00005} shadow-normalBias={.015}/>
  <directionalLight position={[5,3,5]} intensity={.53} color='#d8e9ff'/><primitive object={lampTarget}/>
  <spotLight position={[0,5.31,.26]} target={lampTarget} color='#ffe4b3' intensity={9} angle={.87} penumbra={.9} distance={8} decay={2}/>
  <pointLight position={[-4.98,1.42,.81]} color='#ffe2b0' intensity={2.8} distance={3.5} decay={2}/><pointLight position={[-2.95,2.4,.2]} color='#ffe6b6' intensity={.3} distance={1.3}/>
  <SoftShadows size={25} samples={10} focus={.3}/><primitive object={model.root} onPointerOver={move} onPointerMove={move} onPointerOut={leave} onClick={click}/>
 </>;
}
