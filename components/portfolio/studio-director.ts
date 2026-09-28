import * as T from 'three';
import type {StudioState} from './studio-state';
import type {AigcFolderModel} from './model/workbench';

export type DirectorSnapshot={position:T.Vector3;quaternion:T.Quaternion;fov:number;orbit?:{yaw:number;pitch:number;requestedYaw:number;requestedPitch:number}};
export type DirectorMilestone='collection'|'project'|'inspect'|'idle';
type DirectorModel={aigc:{folders:Record<'red-leaf'|'social',AigcFolderModel>}};

/** Owns all reversible transforms for the AIGC slice. Nothing is remounted while
 * a folder is opening, browsing, inspecting, or returning. */
export class StudioDirector{
 private target:StudioState={mode:'idle',phase:'stable'}; private loaded=new Set<string>();
 private collection=0; private project=0; private inspect=0; private activeItemIndex=0;
 private settled:DirectorMilestone|null=null; private snapshot:DirectorSnapshot|null=null; private justRestored=false;
 private readonly idleTarget=new T.Vector3(0,2.23,.1);
 private readonly focusPosition=new T.Vector3(4.55,4.65,11.35); private readonly focusTarget=new T.Vector3(3.55,3.75,.1);
 private readonly collectionPosition=new T.Vector3(4.15,4.20,9.25); private readonly collectionTarget=new T.Vector3(3.35,3.65,.25);
 private readonly projectPosition=new T.Vector3(3.82,4.10,9.35); private readonly projectTarget=new T.Vector3(3.45,3.88,.72);
 private readonly inspectPosition=new T.Vector3(3.28,4.02,6.65); private readonly inspectTarget=new T.Vector3(3.45,3.92,1.02);
 private readonly displayPositions={red:new T.Vector3(-.42,.40,.88),social:new T.Vector3(.76,.40,.75)};
 constructor(
  private model:DirectorModel, private camera:T.PerspectiveCamera, private reduced:()=>boolean,
  private readSnapshot:()=>DirectorSnapshot, private restoreSnapshot:(snapshot:DirectorSnapshot)=>void,
  private onMilestone:(milestone:DirectorMilestone)=>void,
 ){}
 get isActive(){return this.target.mode!=='idle'||this.collection>.0001||this.project>.0001||this.inspect>.0001||this.justRestored;}
 get targetState(){return this.target;}
 setState(state:StudioState){
  if(state.mode!=='idle'&&this.target.mode==='idle'&&this.collection<.001)this.snapshot=this.readSnapshot();
  if('activeItemIndex' in state)this.activeItemIndex=Math.max(0,state.activeItemIndex);
  this.target=state;this.settled=null;this.justRestored=false;
  if(state.mode==='project'||state.mode==='inspect')this.ensureTextures(state.collectionId,state.mode==='inspect',state.mode==='inspect'?state.itemId:undefined);
 }
 setActiveItemIndex(index:number){
  const folder=this.model.aigc.folders['red-leaf'];this.activeItemIndex=T.MathUtils.clamp(Math.round(index),0,Math.max(0,folder.papers.length-1));this.applyFolder(this.collection,this.project,this.inspect);this.applyCamera(this.collection,this.project,this.inspect);}
 /** QA hook: progress 0..1 drives the complete reversible director without changing React state. */
 setDebugProgress(value:number){const v=T.MathUtils.clamp(value,0,1);this.collection=v;this.project=v;this.inspect=0;this.settled=null;this.applyFolder(v,v,0);this.applyCamera(v,v,0);}
 private ensureTextures(collectionId:string,hires=false,activeId?:string){
  if(collectionId!=='red-leaf')return;
  const folder=this.model.aigc.folders['red-leaf'];
  for(const paper of folder.papers){
   if((hires&&activeId!==paper.id)||(!hires&&this.loaded.has(paper.id))||!paper.imagePath)continue;const key=hires?`${paper.id}:hires`:paper.id;if(this.loaded.has(key))continue;this.loaded.add(key);
   new T.TextureLoader().load(hires?paper.hiresPath:paper.imagePath,texture=>{texture.colorSpace=T.SRGBColorSpace;paper.texture=texture;if(paper.surface){paper.surface.material=new T.MeshBasicMaterial({map:texture,toneMapped:true});} });
  }
 }
 private targetCollection(){return this.target.mode==='idle'?0:1;}
 private targetProject(){return this.target.mode==='project'||this.target.mode==='inspect'?1:0;}
 private targetInspect(){return this.target.mode==='inspect'?1:0;}
 private ease(v:number){return T.MathUtils.smoothstep(T.MathUtils.clamp(v,0,1),0,1);}
 private applyFolder(collection:number,project:number,inspect:number){
  const c=this.ease(collection),p=this.ease(project),i=this.ease(inspect);
  const red=this.model.aigc.folders['red-leaf'],social=this.model.aigc.folders.social;
  for(const [folder,display,rotation] of [[red,this.displayPositions.red,-.12],[social,this.displayPositions.social,.08]] as const){
   folder.root.position.copy(folder.home).lerp(display,c);folder.root.rotation.z=rotation*c;
  }
  const cover=this.ease(p/.68);red.coverPivot.rotation.x=-1.04*cover;
  red.paperStack.visible=p<.88;
  const paperTotal=red.papers.length;
  red.papers.forEach((paper,index)=>{
   let rel=index-this.activeItemIndex;if(rel>paperTotal/2)rel-=paperTotal;if(rel<-paperTotal/2)rel+=paperTotal;const dist=Math.abs(rel),fan=this.ease((p-.16)/.84);
   paper.root.visible=p>.035;
   const home=paper.home;
   const x=rel*.44*fan, y=home.y+.20*fan-(Math.min(dist,2)*.035*fan), z=home.z+.15*fan+(Math.max(0,2-dist)*.18*fan);
   paper.root.position.set(x,y,z);paper.root.rotation.z=(-rel*.10)*fan;paper.root.scale.setScalar((dist===0?1:.68)*fan);
   if(i>.001 && index===this.activeItemIndex){paper.root.position.z+=.76*i;paper.root.position.y+=.12*i;paper.root.scale.setScalar(1+.30*i);paper.root.rotation.z*=1-i;}
  });
  social.papers.forEach((paper,index)=>{paper.root.visible=false;paper.root.position.copy(paper.home);paper.root.scale.setScalar(1);});
  // Keep one stable reference for older QA consumers while the real project now has five papers.
  if(red.heroPaper)red.heroPaper.userData.aigcItem=red.papers[this.activeItemIndex]?.id??red.papers[0]?.id;
 }
 private applyCamera(collection:number,project:number,inspect:number){
  const c=this.ease(collection),p=this.ease(project),i=this.ease(inspect),position=new T.Vector3(),target=new T.Vector3();
  if(c<.42){const t=this.ease(c/.42);position.copy(this.snapshot?.position??this.camera.position).lerp(this.focusPosition,t);target.copy(this.idleTarget).lerp(this.focusTarget,t);}
  else {const t=this.ease((c-.42)/.58);position.copy(this.focusPosition).lerp(this.collectionPosition,t);target.copy(this.focusTarget).lerp(this.collectionTarget,t);}
  if(p>.001){position.lerp(this.projectPosition,p);target.lerp(this.projectTarget,p);}
  if(i>.001){position.lerp(this.inspectPosition,i);target.lerp(this.inspectTarget,i);}
  this.camera.position.copy(position);this.camera.lookAt(target);this.camera.fov=this.snapshot?T.MathUtils.lerp(this.snapshot.fov,Math.max(21,this.snapshot.fov-2.2),Math.max(p,i)):this.camera.fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 }
 tick(delta:number){
  const speed=this.reduced()?1:7.5,previous=[this.collection,this.project,this.inspect];
  if(this.reduced()){this.collection=this.targetCollection();this.project=this.targetProject();this.inspect=this.targetInspect();}
  else {this.collection=T.MathUtils.damp(this.collection,this.targetCollection(),speed,delta);this.project=T.MathUtils.damp(this.project,this.targetProject(),speed,delta);this.inspect=T.MathUtils.damp(this.inspect,this.targetInspect(),speed,delta);}
  const snap=(value:number,target:number)=>Math.abs(value-target)<.0015?target:value;
  this.collection=snap(this.collection,this.targetCollection());this.project=snap(this.project,this.targetProject());this.inspect=snap(this.inspect,this.targetInspect());
  this.applyFolder(this.collection,this.project,this.inspect);this.applyCamera(this.collection,this.project,this.inspect);
  const done=Math.abs(this.collection-this.targetCollection())<.0015&&Math.abs(this.project-this.targetProject())<.0015&&Math.abs(this.inspect-this.targetInspect())<.0015;
  if(done){
   if(this.target.mode==='idle'){if(this.settled!=='idle'){this.settled='idle';if(this.snapshot)this.restoreSnapshot(this.snapshot);this.snapshot=null;this.justRestored=true;this.onMilestone('idle');}}
   else if(this.target.mode==='inspect'){if(this.settled!=='inspect'){this.settled='inspect';this.onMilestone('inspect');}}
   else if(this.target.mode==='project'){if(this.settled!=='project'){this.settled='project';this.onMilestone('project');}}
   else if(this.target.mode==='collection'||this.target.mode==='focus'){if(this.settled!=='collection'){this.settled='collection';this.onMilestone('collection');}}
  }
  const moving=previous.some((v,index)=>Math.abs(v-[this.collection,this.project,this.inspect][index])>.00004)||this.justRestored;if(this.justRestored)this.justRestored=false;return moving;
 }
 debug(){const red=this.model.aigc.folders['red-leaf'];return {collection:this.collection,project:this.project,inspect:this.inspect,activeItemIndex:this.activeItemIndex,folderUUID:red?.root.uuid,paperUUID:red?.heroPaper?.uuid??null,activePaperUUID:red?.papers[this.activeItemIndex]?.root.uuid??null,paperUUIDs:red?.papers.map(p=>p.root.uuid)??[],paperCount:red?.papers.length??0,paperPositions:red?.papers.map(p=>p.root.position.toArray())??[],coverRotation:red?.coverPivot.rotation.x??0};}
}
