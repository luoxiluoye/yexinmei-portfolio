export type StudioZone='aigc';
export type MotionPhase='entering'|'stable'|'leaving';

/** The public route is intentionally shallow: collection is #aigc, project is #aigc/<id>.
 * Inspect has one history entry; changing images replaces that entry. */
export type StudioState=
 | {mode:'idle';phase?:MotionPhase}
 | {mode:'focus';zone:StudioZone;phase:MotionPhase}
 | {mode:'collection';zone:StudioZone;collectionId:string;phase:MotionPhase}
 | {mode:'project';zone:StudioZone;collectionId:string;activeItemIndex:number;phase:MotionPhase}
 | {mode:'inspect';zone:StudioZone;collectionId:string;itemId:string;activeItemIndex:number;phase:MotionPhase};

export const IDLE_STATE:StudioState={mode:'idle',phase:'stable'};

export function studioDepth(state:StudioState){
 if(state.mode==='inspect')return 4;
 if(state.mode==='project')return 3;
 if(state.mode==='collection')return 2;
 if(state.mode==='focus')return 1;
 return 0;
}

export function stateFromHash(hash:string):StudioState{
 const value=hash.replace(/^#/,'').replace(/\/$/,'');
 if(value==='aigc')return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'entering'};
 if(value==='aigc/red-leaf')return {mode:'project',zone:'aigc',collectionId:'red-leaf',activeItemIndex:1,phase:'entering'};
 const match=value.match(/^aigc\/red-leaf\/([^/]+)$/);
 if(match){const index=['landing-hero','gameplay-scene','gameplay-choice','story-library','story-modal'].indexOf(match[1]);return {mode:'inspect',zone:'aigc',collectionId:'red-leaf',itemId:match[1],activeItemIndex:Math.max(0,index),phase:'entering'};}
 return IDLE_STATE;
}

export function hashForStudioState(state:StudioState){
 if(state.mode==='inspect')return `#aigc/${state.collectionId}/${state.itemId}`;
 if(state.mode==='project')return `#aigc/${state.collectionId}`;
 if(state.mode==='collection'||state.mode==='focus')return '#aigc';
 return '';
}

export function studioStateLabel(state:StudioState){
 if(state.mode==='inspect')return `${state.itemId.replaceAll('-',' ').toUpperCase()} · 放大查看`;
 if(state.mode==='project')return '赤页 · 5 WORKS';
 if(state.mode==='collection')return 'VISUAL / AIGC · 2 PROJECTS';
 if(state.mode==='focus')return '视觉与 AIGC';
 if(state.phase==='leaving')return '正在收回 · AIGC';
 return '';
}
