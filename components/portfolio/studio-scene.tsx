'use client';
import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {SoftShadows,useTexture} from '@react-three/drei';
import * as T from 'three';
import {StudioExperience} from './studio-experience';
import {WORK_IMAGES} from './model/workbench';
import type {ZoneId} from './model/atelier-geometry';
export type PortfolioZoneId=ZoneId;
export function StudioScene({onSelect,selected=null,onReady}:{onSelect:(id:ZoneId)=>void;selected?:ZoneId|null;onReady?:()=>void}){
 const images=useTexture(WORK_IMAGES),{gl,scene,camera,size,invalidate}=useThree();
 const experience=useRef<StudioExperience|null>(null);
 const handlers=useRef({onSelect,onReady});handlers.current={onSelect,onReady};
 useEffect(()=>{
  const runtime=new StudioExperience(gl,scene,camera as T.PerspectiveCamera,images,invalidate,id=>handlers.current.onSelect(id),()=>handlers.current.onReady?.());
  runtime.setSize(gl.domElement.clientWidth,gl.domElement.clientHeight);experience.current=runtime;
  return()=>{experience.current=null;runtime.dispose();};
 },[gl,scene,camera,images,invalidate]);
 useEffect(()=>{experience.current?.setSize(size.width,size.height);},[size.width,size.height]);
 useEffect(()=>{experience.current?.setSelected(selected);},[selected]);
 useFrame((_,delta)=>experience.current?.render(delta),1);
 return <SoftShadows size={25} samples={10} focus={.3}/>;
}
