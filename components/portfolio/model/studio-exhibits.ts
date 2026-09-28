import * as T from 'three';
import {AtelierGeometry} from './atelier-geometry';
import {STUDIO_WRITINGS} from '../studio-content';
export type ExhibitObject={root:T.Group;home:T.Vector3;rotation:T.Quaternion;scale:T.Vector3;width:number;height:number;surface?:T.Mesh;original?:T.Material;cover?:T.Group;texture?:T.Texture};
export function exhibit(root:T.Group,width:number,height:number,surface?:T.Mesh):ExhibitObject{
 root.userData.noBatch=true;
 return {root,home:root.position.clone(),rotation:root.quaternion.clone(),scale:root.scale.clone(),width,height,surface,original:surface?.material as T.Material};
}
function wrap(c:CanvasRenderingContext2D,text:string,x:number,y:number,width:number,lineHeight:number){
 let line='';for(const char of text){if(char==='\n'||c.measureText(line+char).width>width){c.fillText(line,x,y);y+=lineHeight;line=char==='\n'?'':char;}else line+=char;}if(line)c.fillText(line,x,y);return y+lineHeight;
}
export function createReadingBook(d:AtelierGeometry,parent:T.Group,index:number,x:number){
 const data=STUDIO_WRITINGS[index],root=new T.Group();parent.add(root);root.name=`Writing / ${data.id}`;root.userData.roomItem=String(index);root.position.set(x,1.28,.025);root.rotation.y=Math.PI/2;
 const w=.82,h=1.24,material=d.mat(data.color,.83),paper=d.mat('#f8f1e3',.93);
 d.box(root,[0,0,0],[w,h,.18],paper,.008);d.box(root,[0,0,-.1],[w+.02,h+.03,.024],material,.006);d.box(root,[-w/2,0,0],[.025,h+.03,.21],material,.006);
 const spineMap=d.canvas((c,W,H)=>{c.fillStyle=data.color;c.fillRect(0,0,W,H);c.fillStyle='#f8ecd9';c.textAlign='center';c.font='26px serif';const title=index===2?data.kind:data.title;Array.from(title).forEach((char,i)=>c.fillText(char,W/2,150+i*38));c.fillRect(25,80,W-50,2);c.fillRect(25,H-80,W-50,2);},128,768);
 const spineMaterial=new T.MeshBasicMaterial({map:spineMap,toneMapped:false});d.materials.add(spineMaterial);d.mesh(root,d.own(new T.PlaneGeometry(.19,h)),spineMaterial,[-w/2-.014,0,0],[0,-Math.PI/2,0]).castShadow=false;
 const cover=new T.Group();cover.position.set(-w/2,0,.105);root.add(cover);d.box(cover,[w/2,0,0],[w+.02,h+.03,.025],material,.008);
 function page(position:[number,number,number],target:T.Object3D,draw:(c:CanvasRenderingContext2D,w:number,h:number)=>void,back=false){const reading=back||target===root;const map=d.canvas((c,W,H)=>{c.scale(W/1024,H/1536);draw(c,1024,1536);},reading?1024:512,reading?1536:768);const mat=new T.MeshBasicMaterial({map,toneMapped:false});d.materials.add(mat);const mesh=d.mesh(target,d.own(new T.PlaneGeometry(w-.025,h-.03)),mat,position);if(back)mesh.rotation.y=Math.PI;if(reading){mesh.visible=false;const pages=(root.userData.readingPages??=[]) as T.Mesh[];pages.push(mesh);}return mesh;}
 page([w/2,0,.015],cover,(c,W,H)=>{c.fillStyle=data.color;c.fillRect(0,0,W,H);c.fillStyle='rgba(255,248,232,.18)';c.fillRect(30,55,3,H-110);c.strokeStyle='rgba(255,248,232,.32)';c.strokeRect(60,70,W-120,H-140);c.fillStyle='#fff8e8';c.font='32px sans-serif';c.fillText(data.kind,65,180);c.font='60px serif';wrap(c,data.title,65,360,W-130,92);c.font='30px sans-serif';c.fillText('罗叶馨梅',65,H-150);});
 page([w/2,0,-.016],cover,(c,W,H)=>{c.fillStyle='#f8f1e3';c.fillRect(0,0,W,H);c.fillStyle='#95604c';c.font='34px sans-serif';c.fillText(data.kind,64,180);c.fillStyle='#332d29';c.font='52px serif';let y=wrap(c,data.title,64,300,W-128,80)+110;c.font='30px sans-serif';for(const line of data.lines)y=wrap(c,line,64,y,W-128,48)+30;c.fillStyle='#8b7c6b';c.font='24px sans-serif';c.fillText('刊发信息 / 作品档案',64,H-100);},true);
 const surface=page([0,0,.103],root,(c,W,H)=>{c.fillStyle='#fff9ef';c.fillRect(0,0,W,H);c.fillStyle='#925d49';c.font='34px sans-serif';c.fillText(data.heading,60,140);c.fillStyle='#332d29';c.font='52px serif';wrap(c,data.excerpt,75,230,W-150,72);c.fillStyle='#8b7c6b';c.font='23px sans-serif';c.fillText('完整内容见发布平台',60,H-90);});
 const result=exhibit(root,w,h,surface);result.cover=cover;return result;
}
