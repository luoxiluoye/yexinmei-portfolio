import * as T from 'three';
import type {StudioState} from './studio-state';
import type {AigcFolderModel,AigcPaperModel} from './model/workbench';

export type DirectorSnapshot={position:T.Vector3;quaternion:T.Quaternion;fov:number;orbit?:{yaw:number;pitch:number;requestedYaw:number;requestedPitch:number}};
export type DirectorMilestone='collection'|'project'|'inspect'|'idle';
type DirectorModel={aigc:{folders:Record<'red-leaf'|'social',AigcFolderModel>}};

/** Persistent physical objects; progress is reversible, never reset on navigation. */
export class StudioDirector{
 private target:StudioState={mode:'idle',phase:'stable'};
 private collection=0;private project=0;private inspect=0;private activeItemIndex=1;
 private settled:DirectorMilestone|null=null;private snapshot:DirectorSnapshot|null=null;
 private viewportHeight=900;
 private disposed=false;private requests=new Map<AigcPaperModel,string>();private pending=new Set<string>();
 private textureErrors=new Set<string>();private layoutMoving=false;
 constructor(private model:DirectorModel,private camera:T.PerspectiveCamera,private reduced:()=>boolean,
  private readSnapshot:()=>DirectorSnapshot,private restoreSnapshot:(snapshot:DirectorSnapshot)=>void,
  private onMilestone:(milestone:DirectorMilestone)=>void,private invalidate:()=>void){}
 setViewport(height:number){this.viewportHeight=height;}
 get isActive(){return this.target.mode!=='idle'||this.collection>0||this.project>0||this.inspect>0;}
 setState(state:StudioState){
  if(state.mode!=='idle'&&!this.snapshot)this.snapshot=this.readSnapshot();
  if('activeItemIndex' in state)this.activeItemIndex=state.activeItemIndex;
  this.target=state;this.settled=null;
  if(state.mode==='project'||state.mode==='inspect')this.ensureTextures();
 }
 private ensureTextures(){
  for(const [index,paper] of this.model.aigc.folders['red-leaf'].papers.entries()){
   const distance=Math.min((index-this.activeItemIndex+5)%5,(this.activeItemIndex-index+5)%5);
   const path=this.target.mode==='inspect'&&distance===0?paper.hiresPath:distance<=1?paper.imagePath:paper.imagePath.replace('/medium/','/thumb/').replace('-medium','-thumb');
   this.requests.set(paper,path);
   if(paper.texture?.userData.path===path||this.pending.has(path))continue;
   this.pending.add(path);this.textureErrors.delete(paper.id);this.notifyTexture(paper.id,'loading');
   new T.TextureLoader().load(path,texture=>{
    this.pending.delete(path);
    if(this.disposed||this.requests.get(paper)!==path){texture.dispose();return;}
    texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;texture.userData.path=path;
    const old=paper.texture;paper.texture=texture;
    const material=paper.surface?.material as T.MeshBasicMaterial;
    material.map=texture;material.color.set('#ffffff');material.needsUpdate=true;old?.dispose();this.notifyTexture(paper.id,'ready');this.invalidate();
   },undefined,()=>{this.pending.delete(path);if(this.requests.get(paper)===path){this.textureErrors.add(paper.id);this.notifyTexture(paper.id,'error');this.invalidate();}});
  }
 }
 retryTextures(){this.ensureTextures();}
 private notifyTexture(id:string,status:string){window.dispatchEvent(new CustomEvent('studio:texture-status',{detail:{id,status}}));}
 private releaseTextures(){this.requests.clear();for(const paper of this.model.aigc.folders['red-leaf'].papers){const mat=paper.surface?.material as T.MeshBasicMaterial;mat.map=null;mat.color.set('#eee8dc');mat.needsUpdate=true;paper.texture?.dispose();paper.texture=undefined;}}
 private ease(v:number){return T.MathUtils.smoothstep(T.MathUtils.clamp(v,0,1),0,1);}
 private applyFolder(delta:number){
  const c=this.collection,p=this.project,i=this.inspect,red=this.model.aigc.folders['red-leaf'],social=this.model.aigc.folders.social;
  const lift=this.ease(c/.32),forward=this.ease((c-.32)/.34),settle=this.ease((c-.66)/.34);
  for(const [folder,x] of [[red,-.65],[social,.65]] as const){
   folder.root.position.copy(folder.home);folder.root.position.y+=.88*lift;
   folder.root.position.z+=1.8*forward;folder.root.position.x=T.MathUtils.lerp(folder.home.x,x,settle);
   folder.root.position.y-=.75*settle;folder.root.rotation.set(0,0,(folder===red?-.045:.045)*settle);
  }
  red.root.position.lerp(new T.Vector3(-.2,-.65,1.65),p);red.root.rotation.z*=1-p;
  social.root.position.lerp(new T.Vector3(1.55,-.50,.65),p);social.root.scale.setScalar(1-.28*p);
  red.coverPivot.rotation.x=-1.04*this.ease(p/.45);red.paperStack.visible=p<.98;
  const fan=this.ease((p-.45)/.55),compact=this.camera.aspect<.9;
  this.layoutMoving=false;
  red.papers.forEach((paper,index)=>{
   let rel=index-this.activeItemIndex;if(rel>2)rel-=5;if(rel< -2)rel+=5;const dist=Math.abs(rel);
   const x=dist===0?-.2:-.2+Math.sign(rel)*(compact?(.84+(dist-1)*.53):(1.22+(dist-1)*.92));
   const display=new T.Vector3(x,.38-dist*.22,dist===0?2.75:2.25-dist*.08);
   if(dist===0)display.lerp(new T.Vector3(-.2,.38,3.85),i);
   else display.x+=Math.sign(rel)*.48*i;
   // Coordinates are in the rack's space, converted to the persistent folder's space.
   display.sub(red.root.position).applyQuaternion(red.root.quaternion.clone().invert());
   const position=paper.home.clone().lerp(display,fan);
   const scale=T.MathUtils.lerp(1,dist===0?T.MathUtils.lerp(compact?1.72:2.2,3.35,i):.94,fan);
   const rotation=(dist===0?0:-rel*.035)*fan;
   const blend=this.reduced()||fan<.995?1:1-Math.exp(-13*delta);
   paper.root.position.lerp(position,blend);paper.root.scale.lerp(new T.Vector3(scale,scale,scale),blend);
   paper.root.rotation.z=T.MathUtils.lerp(paper.root.rotation.z,rotation,blend);
   if(paper.root.position.distanceTo(position)>.0005||Math.abs(paper.root.scale.x-scale)>.0005)this.layoutMoving=true;
   else{paper.root.position.copy(position);paper.root.scale.setScalar(scale);paper.root.rotation.z=rotation;}
   paper.root.visible=p>.02;
   const material=paper.surface?.material as T.MeshBasicMaterial;material.color.setScalar(dist===0?1:1-i*.16);
  });
  social.papers.forEach(paper=>{paper.root.visible=false;});
 }
 private applyCamera(){
  if(!this.snapshot)return;
  const c=this.ease(this.collection),p=this.ease(this.project),i=this.ease(this.inspect),aspect=this.camera.aspect;
  const center=new T.Vector3(3.79,4.225,0);
  const fov=this.snapshot.fov,tan=Math.tan(T.MathUtils.degToRad(fov/2));
  const compact=aspect<.9;
  // Fit the whole physical composition inside header/footer safe areas at every aspect ratio.
  const collectionDistance=Math.max(2.7/.66,3.6/(aspect*.86))/(2*tan)+1.3;
  const projectDistance=Math.max(3.05/.62,(compact?3.95:5.55)/(aspect*.90))/(2*tan)+2.6;
  const safeTop=compact?212:194,safeBottom=126;
  const available=Math.max(.25,(this.viewportHeight-safeTop-safeBottom)/this.viewportHeight);
  const inspectDistance=Math.max(1.78/available,3.45/(aspect*.84))/(2*tan)+3.86;
  const distance=T.MathUtils.lerp(T.MathUtils.lerp(collectionDistance,projectDistance,p),inspectDistance,i);
  const offset=T.MathUtils.lerp(16,(safeTop-safeBottom)/2,Math.max(p,i));
  center.y+=offset*(2*tan*(distance-T.MathUtils.lerp(1.3,3.86,i)))/this.viewportHeight;
  const position=center.clone().add(new T.Vector3(0,0,distance));
  this.camera.position.copy(this.snapshot.position).lerp(position,c);
  this.camera.lookAt(center);const destination=this.camera.quaternion.clone();
  this.camera.quaternion.copy(this.snapshot.quaternion).slerp(destination,c);
  this.camera.fov=fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 }
 tick(delta:number){
  const wantC=this.target.mode==='idle'?0:1,wantP=this.target.mode==='project'||this.target.mode==='inspect'?1:0,wantI=this.target.mode==='inspect'?1:0;
  const step=(value:number,target:number)=>{if(this.reduced())return target;return T.MathUtils.clamp(value+Math.sign(target-value)*delta*.95,Math.min(value,target),Math.max(value,target));};
  // Close / retract inner parts before moving the containing object. Midway Back uses current progress.
  this.inspect=step(this.inspect,wantI);
  this.project=step(this.project,wantP===1?(this.collection===1?1:0):(this.inspect===0?0:this.project));
  this.collection=step(this.collection,wantC===1?1:(this.project===0?0:this.collection));
  this.applyFolder(delta);this.applyCamera();
  const done=this.collection===wantC&&this.project===wantP&&this.inspect===wantI&&!this.layoutMoving;
  if(done){const milestone=this.target.mode==='focus'?'collection':this.target.mode;
   if(this.settled!==milestone){this.settled=milestone;
    if(milestone==='idle'){if(this.snapshot)this.restoreSnapshot(this.snapshot);this.snapshot=null;this.releaseTextures();}
    this.onMilestone(milestone);
   }
  }
  return !done;
 }
 setDebugProgress(value:number){this.collection=T.MathUtils.clamp(value,0,1);this.applyFolder(1);this.applyCamera();}
 debug(){const red=this.model.aigc.folders['red-leaf'];return {collection:this.collection,project:this.project,inspect:this.inspect,activeItemIndex:this.activeItemIndex,folderUUID:red.root.uuid,paperUUID:red.heroPaper?.uuid,paperUUIDs:red.papers.map(p=>p.root.uuid),folderPosition:red.root.position.toArray(),paperPositions:red.papers.map(p=>p.root.position.toArray()),coverRotation:red.coverPivot.rotation.x,textureErrors:[...this.textureErrors],papers:red.papers.map(p=>({id:p.id,width:p.width,height:p.height,textureWidth:p.texture?.image?.width??0,path:p.texture?.userData.path??null,corners:[[-p.width/2,-p.height/2],[p.width/2,-p.height/2],[p.width/2,p.height/2],[-p.width/2,p.height/2]].map(([x,y])=>p.surface!.localToWorld(new T.Vector3(x,y,0)).project(this.camera).toArray())}))};}
 dispose(){this.disposed=true;this.releaseTextures();}
}
