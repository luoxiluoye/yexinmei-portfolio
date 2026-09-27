export type StudioZone='aigc';
export type MotionPhase='entering'|'stable'|'leaving';
export type StudioState=
 | {mode:'idle';phase?:MotionPhase}
 | {mode:'focus';zone:StudioZone;phase:MotionPhase}
 | {mode:'collection';zone:StudioZone;collectionId:string;phase:MotionPhase}
 | {mode:'item';zone:StudioZone;collectionId:string;itemId:string;phase:MotionPhase};

export const IDLE_STATE:StudioState={mode:'idle',phase:'stable'};

export function studioDepth(state:StudioState){
 if(state.mode==='item')return 3;
 if(state.mode==='collection')return 2;
 if(state.mode==='focus')return 1;
 return 0;
}

export function stateFromHash(hash:string):StudioState{
 const value=hash.replace(/^#/,'').replace(/\/$/,'');
 if(value==='aigc')return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'entering'};
 if(value==='aigc/red-leaf/gameplay-scene')return {mode:'item',zone:'aigc',collectionId:'red-leaf',itemId:'gameplay-scene',phase:'entering'};
 return IDLE_STATE;
}

export function hashForStudioState(state:StudioState){
 if(state.mode==='item')return '#aigc/red-leaf/gameplay-scene';
 if(state.mode==='collection'||state.mode==='focus')return '#aigc';
 return '';
}

export function studioStateLabel(state:StudioState){
 if(state.mode==='item')return '赤页 · Gameplay Scene';
 if(state.mode==='collection')return '赤页 Red Leaf';
 if(state.mode==='focus')return '视觉与 AIGC';
 if(state.phase==='leaving')return '正在收回 · AIGC';
 return '';
}
