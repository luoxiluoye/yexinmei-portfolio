'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { SoftShadows, useTexture } from '@react-three/drei';
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createWorkbench, WORK_IMAGES } from './model/workbench';
import type { ZoneId } from './model/atelier-geometry';

export type PortfolioZoneId = ZoneId;

declare global {
 interface Window {
  __STUDIO_QA__?: {stats:{meshes:number;triangles:number;version:string};points:Record<string,{x:number;y:number}>};
 }
}

export function StudioScene({onSelect,selected=null,onReady}:{onSelect:(id:ZoneId)=>void;selected?:ZoneId|null;onReady?:()=>void}) {
 const images=useTexture(WORK_IMAGES);
 const model=useMemo(()=>createWorkbench(images),[images]);
 const {gl,scene,camera,size}=useThree();
 const hovered=useRef<ZoneId|null>(null),ready=useRef(false),frames=useRef(0);
 const reduced=useRef(false),qa=useRef(false);
 const target=useRef(new T.Vector3(0,2.23,.1));
 const t1=useMemo(()=>{const t=new T.Object3D();t.position.set(0,1.7,-.4);return t;},[]);
 const colors:Record<ZoneId,T.Color>=useMemo(()=>({writing:new T.Color('#ffc6a0'),photography:new T.Color('#a5d4ff'),aigc:new T.Color('#ffe0a4'),video:new T.Color('#ffa5a1')}),[]);
 const idleColor=useMemo(()=>new T.Color('#ffead1'),[]);

 useEffect(()=>{
  reduced.current=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  qa.current=new URLSearchParams(window.location.search).get('qa')==='1';
  gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=1.02;gl.outputColorSpace=T.SRGBColorSpace;
  const pmrem=new T.PMREMGenerator(gl),room=new RoomEnvironment();
  const env=pmrem.fromScene(room,.045);const previous=scene.environment;
  scene.environment=env.texture;scene.environmentIntensity=.32;
  room.dispose();pmrem.dispose();
  let meshes=0,triangles=0;model.root.traverse(o=>{if(o instanceof T.Mesh&&!o.userData.noBatch){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o instanceof T.InstancedMesh?o.count:1);}});
  if(qa.current)window.__STUDIO_QA__={stats:{meshes,triangles,version:'atelier-detailed-20260924'},points:{}};
  return()=>{scene.environment=previous;env.dispose();document.body.style.cursor='';delete document.documentElement.dataset.studioReady;delete document.documentElement.dataset.studioHover;delete window.__STUDIO_QA__;};
 },[gl,scene,model]);
 useEffect(()=>()=>model.dispose(),[model]);

 const post=useMemo(()=>{
  const rt=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:4});
  const composer=new EffectComposer(gl,rt);
  const render=new RenderPass(scene,camera);
  const ao=new SSAOPass(scene,camera,1,1,16);ao.kernelRadius=.22;ao.minDistance=.001;ao.maxDistance=.14;
  const bloom=new UnrealBloomPass(new T.Vector2(1,1),.19,.46,1.0);
  const output=new OutputPass();
  composer.addPass(render);composer.addPass(ao);composer.addPass(bloom);composer.addPass(output);
  return {composer,ao,render,bloom,output};
 },[gl,scene,camera]);
 useEffect(()=>{
  post.composer.setPixelRatio(gl.getPixelRatio());post.composer.setSize(size.width,size.height);
  post.ao.enabled=size.width>=700;post.render.enabled=!post.ao.enabled;
 },[post,size,gl]);
 useEffect(()=>()=>{post.ao.dispose();post.bloom.dispose();post.output.dispose();post.composer.dispose();},[post]);

 function zoneOf(object:T.Object3D):ZoneId|null {
  for(let node:T.Object3D|null=object;node;node=node.parent){if(node.userData.zone)return node.userData.zone as ZoneId;}
  return null;
 }
 function move(event:ThreeEvent<PointerEvent>) {
  const id=zoneOf(event.object);if(id){event.stopPropagation();hovered.current=id;document.body.style.cursor='pointer';document.documentElement.dataset.studioHover=id;}
 }
 function leave(){hovered.current=null;document.body.style.cursor='';delete document.documentElement.dataset.studioHover;}
 function click(event:ThreeEvent<MouseEvent>){const id=zoneOf(event.object);if(id){event.stopPropagation();onSelect(id);}}

 useFrame(({pointer},delta)=>{
  const dt=Math.min(delta,.07),aspect=size.width/Math.max(1,size.height);
  const distance=17.1*Math.max(1,1.60/aspect);
  const anchor=selected?model.zones[selected].anchor:null;
  const parallax=reduced.current?0:.055;
  const focusX=anchor?anchor.x*.25:0,focusY=anchor?2.23+(anchor.y-2.23)*.25:2.23;
  camera.position.x=T.MathUtils.damp(camera.position.x,focusX+pointer.x*parallax,5,dt);
  camera.position.y=T.MathUtils.damp(camera.position.y,focusY+1.52+pointer.y*parallax*.55,5,dt);
  camera.position.z=T.MathUtils.damp(camera.position.z,distance-(selected?.7:0),5,dt);
  target.current.lerp(new T.Vector3(focusX,focusY,.1),1-Math.exp(-6*dt));camera.lookAt(target.current);
  for(const [id,z] of Object.entries(model.zones)){
   const active=id===(selected||hovered.current);
   z.glow.emissive.lerp(active?colors[id as ZoneId]:idleColor,1-Math.exp(-12*dt));
   z.glow.emissiveIntensity=T.MathUtils.damp(z.glow.emissiveIntensity,active?2.7:.23,11,dt);
   z.hit.visible=false;
  }
  post.composer.render(dt);
  for(const z of Object.values(model.zones))z.hit.visible=true;
  frames.current++;
  if(frames.current>5&&!ready.current){ready.current=true;document.documentElement.dataset.studioReady='true';onReady?.();}
  if(qa.current&&window.__STUDIO_QA__){
   const rect=gl.domElement.getBoundingClientRect();
   for(const [id,z] of Object.entries(model.zones)){
    const projected=z.anchor.clone().project(camera);
    window.__STUDIO_QA__.points[id]={x:rect.left+(projected.x*.5+.5)*rect.width,y:rect.top+(-projected.y*.5+.5)*rect.height};
   }
  }
 },1);

 return <>
  <color attach='background' args={['#edeae4']} />
  <ambientLight intensity={.22} color='#fff2de' />
  <hemisphereLight intensity={.5} color='#f1f5ff' groundColor='#b2a38e' />
  <directionalLight position={[-3.8,8,6]} intensity={2.7} color='#fff1da' castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-5} shadow-camera-near={.1} shadow-camera-far={26} shadow-bias={-.00005} shadow-normalBias={.015} />
  <directionalLight position={[5,3,5]} intensity={.55} color='#d8e9ff' />
  <primitive object={t1}/>
  <spotLight position={[0,5.31,.26]} target={t1} color='#ffe4b3' intensity={9} angle={.87} penumbra={.9} distance={8} decay={2} />
  <pointLight position={[-5.18,1.42,.88]} color='#ffe2b0' intensity={3.1} distance={3.5} decay={2}/>
  <pointLight position={[-2.95,2.4,.2]} color='#ffe6b6' intensity={.3} distance={1.3}/>
  <SoftShadows size={18} samples={10} focus={.3}/>
  <primitive object={model.root} onPointerOver={move} onPointerMove={move} onPointerOut={leave} onClick={click}/>
 </>;
}
