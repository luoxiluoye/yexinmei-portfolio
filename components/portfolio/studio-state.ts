import {STUDIO_PHOTOS,STUDIO_WRITINGS,type RoomZone} from './studio-content';
import {collectionContent,type AigcCollectionId} from './aigc-content';
export type StudioZone='aigc';
export type MotionPhase='entering'|'stable'|'leaving';
/** Opening and fan-out are director progress, never a separate visitor page. */
export type AigcState=
 | {mode:'idle';phase?:MotionPhase}
 | {mode:'focus';zone:StudioZone;phase:MotionPhase}
 | {mode:'collection';zone:StudioZone;collectionId:string;phase:MotionPhase}
 | {mode:'inspect';zone:StudioZone;collectionId:AigcCollectionId;itemId:string;activeItemIndex:number;phase:MotionPhase};
export type RoomState={mode:'room';zone:RoomZone;itemIndex:number|null;page:number;phase:MotionPhase};
export type StudioState=AigcState|RoomState;
export const IDLE_STATE:StudioState={mode:'idle',phase:'stable'};
export function studioDepth(state:StudioState){return state.mode==='room'?(state.itemIndex===null?2:3):state.mode==='inspect'?3:state.mode==='collection'?2:state.mode==='focus'?1:0;}
export function stateFromHash(hash:string):StudioState{
 const value=hash.replace(/^#/,'').replace(/\/$/,'');
 const room=value.match(/^(photography|writing|video)(?:\/([^/]+))?$/);
 if(room){const zone=room[1] as RoomZone,items=zone==='photography'?STUDIO_PHOTOS:STUDIO_WRITINGS,index=items.findIndex(item=>item.id===room[2]);return {mode:'room',zone,itemIndex:index<0?null:index,page:0,phase:'entering'};}
 if(value==='aigc')return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'entering'};
 const match=value.match(/^aigc\/(red-leaf|social)(?:\/([^/]+))?$/);
 if(match){const content=collectionContent(match[1]),index=content.items.findIndex(item=>item.id===match[2]),activeItemIndex=index<0?content.initialIndex:index;
  return {mode:'inspect',zone:'aigc',collectionId:content.id,itemId:content.items[activeItemIndex].id,activeItemIndex,phase:'entering'};
 }
 return IDLE_STATE;
}
export function hashForStudioState(state:StudioState){
 if(state.mode==='room'){const items=state.zone==='photography'?STUDIO_PHOTOS:STUDIO_WRITINGS;return `#${state.zone}${state.itemIndex===null?'':'/'+items[state.itemIndex].id}`;}
 if(state.mode==='inspect')return `#aigc/${state.collectionId}/${state.itemId}`;
 return state.mode==='collection'||state.mode==='focus'?'#aigc':'';
}
