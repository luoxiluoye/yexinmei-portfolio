'use client';
import {useEffect,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as T from 'three';
import {StudioExperience} from './studio-experience';
import {WORK_IMAGES} from './model/workbench';
import type {ZoneId} from './model/atelier-geometry';
import type {StudioState} from './studio-state';
import type {DirectorMilestone} from './studio-director';
export type PortfolioZoneId=ZoneId;
export function StudioScene({onSelect,onSelectFolder,onSelectInspect,onProjectNavigate,onDirectorMilestone,studioState,selected=null,onReady}:{onSelect:(id:ZoneId)=>void;onSelectFolder:(id:string)=>void;onSelectInspect:(id:string)=>void;onProjectNavigate:(delta:number)=>void;onDirectorMilestone:(milestone:DirectorMilestone)=>void;studioState:StudioState;selected?:ZoneId|null;onReady?:()=>void}){
 const images=useTexture(WORK_IMAGES),{gl,scene,camera,size,invalidate}=useThree();
 const experience=useRef<StudioExperience|null>(null);
 const handlers=useRef({onSelect,onSelectFolder,onSelectInspect,onProjectNavigate,onDirectorMilestone,onReady});handlers.current={onSelect,onSelectFolder,onSelectInspect,onProjectNavigate,onDirectorMilestone,onReady};
 useEffect(()=>{
  const runtime=new StudioExperience(gl,scene,camera as T.PerspectiveCamera,images,invalidate,id=>handlers.current.onSelect(id),id=>handlers.current.onSelectFolder(id),id=>handlers.current.onSelectInspect(id),delta=>handlers.current.onProjectNavigate(delta),milestone=>handlers.current.onDirectorMilestone(milestone),()=>handlers.current.onReady?.());
  runtime.setSize(gl.domElement.clientWidth,gl.domElement.clientHeight);experience.current=runtime;
  return()=>{experience.current=null;runtime.dispose();};
 },[gl,scene,camera,images,invalidate]);
 useEffect(()=>{experience.current?.setSize(size.width,size.height);},[size.width,size.height]);
 useEffect(()=>{experience.current?.setSelected(selected);},[selected]);
 useEffect(()=>{experience.current?.setStudioState(studioState);},[studioState]);
 useFrame((_,delta)=>experience.current?.render(delta),1);
 return null;
}
