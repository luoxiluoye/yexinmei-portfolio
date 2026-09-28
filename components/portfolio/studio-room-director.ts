import * as T from 'three';
import type {createWorkbench} from './model/workbench';
import type {ExhibitObject} from './model/studio-exhibits';
import type {RoomState,StudioState} from './studio-state';
import type {DirectorSnapshot,DirectorMilestone} from './studio-director';
import {STUDIO_PHOTOS} from './studio-content';
const ease=(v:number)=>T.MathUtils.smoothstep(v,0,1);
/** The same shelf objects travel out and back. Navigation changes targets, never instances. */
export class StudioRoomDirector{
 private target:RoomState|null=null;private zone:RoomState['zone']='photography';private progress=0;
 private detail:number[]=[];private snapshot:DirectorSnapshot|null=null;private settled=false;private height=900;
 private requests=new Map<ExhibitObject,string>();private pending=new Map<ExhibitObject,string>();private disposed=false;
 constructor(private model:ReturnType<typeof createWorkbench>,private camera:T.PerspectiveCamera,private reduced:()=>boolean,private read:()=>DirectorSnapshot,private restore:(value:DirectorSnapshot)=>void,private milestone:(value:DirectorMilestone)=>void,private invalidate:()=>void){}
 get isActive(){return this.target!==null||this.progress>0;}
 setViewport(height:number){this.height=height;this.settled=false;}
 setState(state:StudioState){
  if(state.mode==='room'){if(!this.snapshot)this.snapshot=this.read();this.zone=state.zone;this.target=state;this.loadPhotos();}else this.target=null;
  this.settled=false;
 }
 get objects(){return this.zone==='photography'?this.model.rooms.photoPrints:this.zone==='writing'?this.model.rooms.writingBooks:[this.model.rooms.television];}
 private loadPhotos(){if(this.target?.zone!=='photography')return;this.model.rooms.photoPrints.forEach((item,index)=>{
  const data=STUDIO_PHOTOS[index],path=this.target?.itemIndex===index?data.src:data.medium;this.requests.set(item,path);
  if(item.texture?.userData.path===path||this.pending.get(item)===path)return;
  this.pending.set(item,path);new T.TextureLoader().load(path,texture=>{if(this.pending.get(item)===path)this.pending.delete(item);if(this.disposed||this.requests.get(item)!==path){texture.dispose();return;}texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;texture.userData.path=path;
   const previous=item.texture;item.texture=texture;const mat=this.photoMaterial(item);mat.map=texture;mat.color.set('#ffffff');mat.needsUpdate=true;previous?.dispose();this.invalidate();
  },undefined,()=>{this.pending.delete(item);if(this.requests.get(item)===path){window.dispatchEvent(new CustomEvent('studio:room-texture-error',{detail:index}));this.invalidate();}});
 });}
 retryTextures(){this.loadPhotos();}
 private photoMaterial(item:ExhibitObject){if(item.surface!.material===item.original){const material=new T.MeshBasicMaterial({color:'#eee6d9',toneMapped:false});this.model.geometry.materials.add(material);item.surface!.userData.readingMaterial=material;item.surface!.material=material;}return item.surface!.material as T.MeshBasicMaterial;}
 private release(){this.requests.clear();this.model.rooms.photoPrints.forEach(item=>{item.surface!.material=item.original!;const material=item.surface!.userData.readingMaterial as T.MeshBasicMaterial|undefined;if(material){this.model.geometry.materials.delete(material);material.dispose();delete item.surface!.userData.readingMaterial;}item.texture?.dispose();item.texture=undefined;});}
 private step(value:number,target:number,dt:number){return this.reduced()?target:T.MathUtils.clamp(value+Math.sign(target-value)*dt*1.25,Math.min(value,target),Math.max(value,target));}
 tick(dt:number){
  const items=this.objects,wanted=this.target?.itemIndex??-1,compact=this.camera.aspect<.9;
  let moving=false;
  items.forEach((_,index)=>{this.detail[index]=this.step(this.detail[index]??0,this.target&&wanted===index&&this.progress===1?1:0,dt);});
  this.progress=this.step(this.progress,this.target?1:this.detail.some(v=>v>0)?this.progress:0,dt);
  const c=ease(this.progress),maxDetail=Math.max(0,...this.detail),page=this.target?.page??0;
  const center=this.zone==='photography'?new T.Vector3(-.23,3.25,0):this.zone==='writing'?new T.Vector3(-4.05,3.40,0):new T.Vector3(3.99,1.5,0);
  items.forEach((item,index)=>{
   const d=ease(this.detail[index]??0),position=item.home.clone(),rotation=item.rotation.clone(),scale=item.scale.clone();
   const parentWorld=item.root.parent!.getWorldPosition(new T.Vector3());
   let target=center.clone(),targetScale=new T.Vector3(1,1,1),targetRotation=new T.Quaternion();
   if(this.zone==='photography'){
    const data=STUDIO_PHOTOS[index],aspect=data.width/data.height,columns=compact?2:4,rows=compact?3:4,slot=compact?index-page*6:index;
    const h=Math.min(compact?1.02:1.0,(compact?1.28:1.5)/aspect),w=h*aspect;
    target.add(new T.Vector3(((slot%columns)-(columns-1)/2)*(compact?1.5:1.7),((rows-1)/2-Math.floor(slot/columns))*1.24,1.65));
    targetScale.set(w/item.width,h/item.height,1);
    const inspectH=Math.min(3.0,4.1/aspect),inspectW=inspectH*aspect;
    target.lerp(center.clone().add(new T.Vector3(0,0,3.6)),d);targetScale.lerp(new T.Vector3(inspectW/item.width,inspectH/item.height,1),d);
    item.root.visible=this.progress>0?(compact?(slot>=0&&slot<6)||d>0:true):index<6;
    const mat=item.surface!.material as T.MeshBasicMaterial;if(item.texture)mat.color.setScalar(wanted<0||wanted===index?1:.78);
   }else if(this.zone==='writing'){
    const col=compact?index%2:index,row=compact?Math.floor(index/2):0;
    target.add(new T.Vector3((col-(compact?.5:1.5))*.9,compact?.8-row*1.6:0,1.55));
    target.lerp(center.clone().add(new T.Vector3(1.025,0,3.1)),d);targetScale.setScalar(1+1.5*d);
    item.cover!.rotation.y=-Math.PI*ease(Math.max(0,(d-.2)/.8));
    for(const page of item.root.userData.readingPages as T.Mesh[]){const visible=d>.01;if(page.visible!==visible){page.visible=visible;const texture=(page.material as T.MeshBasicMaterial).map!;if(visible)texture.needsUpdate=true;else texture.dispose();}}
   }else{target.add(new T.Vector3(0,0,.80));}
   target.sub(parentWorld);
   // Books first leave the shelf forwards, then turn toward the reader.
   if(this.zone==='writing'){const out=ease(this.progress/.45),turn=ease((this.progress-.35)/.65);position.z+=1.05*out;position.lerp(target,turn);rotation.slerp(targetRotation,turn);scale.lerp(targetScale,c);}else{position.lerp(target,c);rotation.slerp(targetRotation,c);scale.lerp(targetScale,c);}
   const blend=this.reduced()||this.progress<1?1:1-Math.exp(-14*dt);
   item.root.position.lerp(position,blend);item.root.quaternion.slerp(rotation,blend);item.root.scale.lerp(scale,blend);
   if(item.root.position.distanceTo(position)>.0005||item.root.quaternion.angleTo(rotation)>.0005||item.root.scale.distanceTo(scale)>.0005)moving=true;
   else{item.root.position.copy(position);item.root.quaternion.copy(rotation);item.root.scale.copy(scale);}
   if(this.progress===0){item.root.position.copy(item.home);item.root.quaternion.copy(item.rotation);item.root.scale.copy(item.scale);if(item.cover)item.cover.rotation.y=0;}
  });
  if(this.snapshot){
   const top=compact?150:160,bottom=compact?160:140,available=Math.max(.25,(this.height-top-bottom)/this.height),tan=Math.tan(T.MathUtils.degToRad(this.snapshot.fov/2));
   let width=this.zone==='photography'?(compact?3.1:6.7):this.zone==='writing'?(compact?2:3.7):3.0;
   let height=this.zone==='photography'?(compact?3.7:4.8):this.zone==='writing'?(compact?3.1:1.5):1.7;
   if(this.zone==='photography'){const photo=STUDIO_PHOTOS[wanted<0?0:wanted],aspect=photo.width/photo.height;const h=Math.min(3,4.1/aspect);width=T.MathUtils.lerp(width,h*aspect+.22,ease(maxDetail));height=T.MathUtils.lerp(height,h+.30,ease(maxDetail));}
   if(this.zone==='writing'){width=T.MathUtils.lerp(width,compact?2.3:4.4,ease(maxDetail));height=T.MathUtils.lerp(height,3.3,ease(maxDetail));}
   if(this.zone==='writing'&&compact)center.x+=1.025*ease(maxDetail);
   const z=T.MathUtils.lerp(this.zone==='video'?.8:1.65,this.zone==='writing'?3.1:3.6,ease(maxDetail));
   const distance=Math.max(height/available,width/(this.camera.aspect*.88))/(2*tan);
   center.y+=(top-bottom)/2*(2*tan*distance)/this.height;
   const destination=center.clone().add(new T.Vector3(0,0,z+distance));
   const cameraTarget=this.snapshot.position.clone().lerp(destination,c);if(this.progress===1&&!this.reduced()){this.camera.position.lerp(cameraTarget,1-Math.exp(-14*dt));if(this.camera.position.distanceTo(cameraTarget)>.0005)moving=true;else this.camera.position.copy(cameraTarget);}else this.camera.position.copy(cameraTarget);this.camera.lookAt(center);const q=this.camera.quaternion.clone();this.camera.quaternion.copy(this.snapshot.quaternion).slerp(q,c);this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
  }
  const done=this.progress===(this.target?1:0)&&items.every((_,i)=>(this.detail[i]??0)===(this.target&&wanted===i?1:0))&&!moving;
  if(done&&!this.settled){this.settled=true;if(!this.target){if(this.snapshot)this.restore(this.snapshot);this.snapshot=null;this.detail=[];this.release();this.milestone('idle');}else this.milestone('room');}
  return !done;
 }
 pick(ray:T.Raycaster){const visible=this.objects.filter(item=>item.root.visible);for(const hit of ray.intersectObjects(visible.map(item=>item.root),true)){let object:T.Object3D|null=hit.object;while(object&&object.userData.roomItem===undefined)object=object.parent;if(object)return String(object.userData.roomItem);}return null;}
 debug(){return {zone:this.zone,progress:this.progress,detail:this.detail,objects:this.objects.map(item=>({uuid:item.root.uuid,position:item.root.position.toArray(),home:item.home.toArray(),rotation:item.root.quaternion.toArray(),homeRotation:item.rotation.toArray(),cover:item.cover?.rotation.y,visible:item.root.visible,texture:item.texture?.userData.path??null,textureWidth:item.texture?.image?.width??0,corners:[[-item.width/2,-item.height/2],[item.width/2,-item.height/2],[item.width/2,item.height/2],[-item.width/2,item.height/2]].map(([x,y])=>item.root.localToWorld(new T.Vector3(x,y,.12)).project(this.camera).toArray())}))};}
 dispose(){this.disposed=true;this.release();}
}
