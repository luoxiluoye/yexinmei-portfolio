import * as T from 'three';
import type {StudioState} from './studio-state';
import type {AigcFolderModel} from './model/workbench';

export type DirectorSnapshot={position:T.Vector3;quaternion:T.Quaternion;fov:number;orbit?:{yaw:number;pitch:number;requestedYaw:number;requestedPitch:number}};
export type DirectorMilestone='collection'|'item'|'idle';
type DirectorModel={aigc:{folders:Record<'red-leaf'|'social',AigcFolderModel>}};

/** Drives the AIGC slice in one Canvas. It owns reversible progress instead of mounting pages. */
export class StudioDirector{
 private target:StudioState={mode:'idle',phase:'stable'};
 private collection=0;private item=0;private settled:DirectorMilestone|null=null;
 private snapshot:DirectorSnapshot|null=null;private justRestored=false;
 private readonly idleTarget=new T.Vector3(0,2.23,.1);
 private readonly focusPosition=new T.Vector3(4.55,4.65,11.35);
 private readonly focusTarget=new T.Vector3(3.55,3.75,.1);
 private readonly collectionPosition=new T.Vector3(4.15,4.20,9.25);
 private readonly collectionTarget=new T.Vector3(3.35,3.65,.25);
 private readonly itemPosition=new T.Vector3(3.65,4.05,7.45);
 private readonly itemTarget=new T.Vector3(3.35,3.88,.52);
 private readonly displayPosition=new T.Vector3(-.14,.43,.90);
 private readonly displayRotationZ=-.12;
 constructor(
  private model:DirectorModel,
  private camera:T.PerspectiveCamera,
  private reduced:()=>boolean,
  private readSnapshot:()=>DirectorSnapshot,
  private restoreSnapshot:(snapshot:DirectorSnapshot)=>void,
  private onMilestone:(milestone:DirectorMilestone)=>void,
 ){ }
 get isActive(){return this.target.mode!=='idle'||this.collection>.0001||this.item>.0001||this.justRestored;}
 get targetState(){return this.target;}
 setState(state:StudioState){
  if(state.mode!=='idle'&&this.target.mode==='idle'&&this.collection<.001)this.snapshot=this.readSnapshot();
  this.target=state;this.settled=null;this.justRestored=false;
 }
 setDebugProgress(collection:number){
  this.collection=T.MathUtils.clamp(collection,0,1);this.item=0;this.settled=null;this.applyFolder(this.collection,0);this.applyCamera(this.collection,0);
 }
 private targetCollection(){return this.target.mode==='idle'?0:1;}
 private targetItem(){return this.target.mode==='item'?1:0;}
 private ease(value:number){return T.MathUtils.smoothstep(T.MathUtils.clamp(value,0,1),0,1);}
 private applyFolder(c:number,i:number){
  const folder=this.model.aigc.folders['red-leaf'];if(!folder)return;
  const eased=this.ease(c),base=folder.home;
  folder.root.position.copy(base).lerp(this.displayPosition,eased);
  folder.root.rotation.z=this.displayRotationZ*eased;
  // The cover starts opening only after the collection has settled enough to
  // expose the hinge. The paper starts moving after the cover clears it.
  const cover=this.ease(i/.68);folder.coverPivot.rotation.x=-1.04*cover;
  const paperT=this.ease((i-.34)/.66);
  if(folder.heroPaper){
   folder.heroPaper.position.set(0,.05, .145);
   folder.heroPaper.position.y+=.06*paperT;
   folder.heroPaper.position.z+=.52*paperT;
   const paperScale=.58+.42*paperT;folder.heroPaper.scale.setScalar(paperScale);
   folder.heroPaper.rotation.x=.035*paperT;
   folder.heroPaper.rotation.z=-.018*paperT;
  }
  folder.paperStack.visible=paperT<.92;
 }
 private applyCamera(c:number,i:number){
  const eased=this.ease(c),position=new T.Vector3(),target=new T.Vector3();
  if(eased<.42){
   const t=this.ease(eased/.42);position.copy(this.snapshot?.position??this.camera.position).lerp(this.focusPosition,t);target.copy(this.idleTarget).lerp(this.focusTarget,t);
  }else{
   const t=this.ease((eased-.42)/.58);position.copy(this.focusPosition).lerp(this.collectionPosition,t);target.copy(this.focusTarget).lerp(this.collectionTarget,t);
  }
  if(i>.001){const t=this.ease(i);position.lerp(this.itemPosition,t);target.lerp(this.itemTarget,t);}
  this.camera.position.copy(position);this.camera.lookAt(target);this.camera.fov=this.snapshot?T.MathUtils.lerp(this.snapshot.fov,Math.max(22,this.snapshot.fov-1.5),this.ease(i)):this.camera.fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 }
 tick(delta:number){
  const speed=this.reduced()?1:7.5;const previousC=this.collection,previousI=this.item;
  if(this.reduced()){this.collection=this.targetCollection();this.item=this.targetItem();}else{
   this.collection=T.MathUtils.damp(this.collection,this.targetCollection(),speed,delta);
   this.item=T.MathUtils.damp(this.item,this.targetItem(),speed,delta);
  }
  if(Math.abs(this.collection-this.targetCollection())<.0015)this.collection=this.targetCollection();
  if(Math.abs(this.item-this.targetItem())<.0015)this.item=this.targetItem();
  this.applyFolder(this.collection,this.item);this.applyCamera(this.collection,this.item);
  const cDone=Math.abs(this.collection-this.targetCollection())<.0015,iDone=Math.abs(this.item-this.targetItem())<.0015;
  if(cDone&&iDone){
   if(this.target.mode==='idle'){
    if(this.settled!=='idle'){this.settled='idle';if(this.snapshot)this.restoreSnapshot(this.snapshot);this.snapshot=null;this.justRestored=true;this.onMilestone('idle');}
   }else if(this.target.mode==='item'){
    if(this.settled!=='item'){this.settled='item';this.onMilestone('item');}
   }else if(this.settled!=='collection'){
    this.settled='collection';this.onMilestone('collection');
   }
  }
  const moving=Math.abs(previousC-this.collection)>.00004||Math.abs(previousI-this.item)>.00004||this.justRestored;
  if(this.justRestored)this.justRestored=false;
  return moving;
 }
 debug(){return {collection:this.collection,item:this.item,folderUUID:this.model.aigc.folders['red-leaf']?.root.uuid,paperUUID:this.model.aigc.folders['red-leaf']?.heroPaper?.uuid??null,coverRotation:this.model.aigc.folders['red-leaf']?.coverPivot.rotation.x??0};}
}
