import * as T from 'three';
import {TessellateModifier} from 'three/examples/jsm/modifiers/TessellateModifier.js';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {AtelierGeometry, type V, type Zone, type ZoneId} from './atelier-geometry';

type Palette=Record<string,T.MeshStandardMaterial>;

/** Rounded outline in XY, extruded in Z. The silhouette radius is independent of thickness. */
function upholsteredPanel(d:AtelierGeometry,parent:T.Object3D,pos:V,w:number,h:number,depth:number,corner:number,mat:T.Material){
 const shape=d.rect(w-.09,h-.09,corner);
 const base=d.own(new T.ExtrudeGeometry(shape,{depth:depth-.10,steps:2,bevelEnabled:true,bevelSize:.046,bevelThickness:.05,bevelSegments:6,curveSegments:18}));
 base.translate(0,0,-(depth-.10)/2);
 const tessellated=new TessellateModifier(.22,4).modify(base);
 const geo=d.own(mergeVertices(tessellated,.00001));tessellated.dispose();
 const p=geo.getAttribute('position');
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  const crown=Math.pow(Math.max(0,1-(x/(w*.52))**2),2)*Math.max(0,1-(y/(h*.54))**2);
  p.setZ(i,z+(z>=0?1:-1)*.055*crown);
 }
 geo.computeVertexNormals();
 return d.mesh(parent,geo,mat,pos);
}

export function makeRearViewChair(d:AtelierGeometry,parent:T.Object3D,p:Palette){
 const chair=new T.Group();chair.name='Rear-facing upholstered chair';
 chair.position.set(-.14,-.98,2.90);parent.add(chair);
 // Camera is at +Z; the sitting direction and both armrests extend toward -Z.
 chair.userData={forward:[0,0,-1],backZ:2.90,armFrontZ:1.77,seatCenterZ:2.13};
 const weave=d.canvas((c,w,h)=>{
  c.fillStyle='#b5b1a9';c.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){
   const v=162+Math.round(d.rnd()*45);c.fillStyle=`rgb(${v},${v},${v})`;
   c.fillRect(x,y,3,1);c.fillRect(x+1,y+1,1,3);
  }
 },256,256);
 weave.colorSpace=T.NoColorSpace;weave.wrapS=weave.wrapT=T.RepeatWrapping;weave.repeat.set(9,5);
 const cloth=d.physical('#dfd4c4',{roughness:.84,metalness:0,clearcoat:0,sheen:.22,sheenColor:new T.Color('#f5eddd'),sheenRoughness:.75,bumpMap:weave,bumpScale:.0023});
 const piping=d.mat('#cfc2b2',.87);
 const back=upholsteredPanel(d,chair,[0,.54,.04],3.40,1.27,.235,.29,cloth);back.name='Chair back outer upholstery';
 const outline=d.rect(3.27,1.14,.24).getPoints(32);
 d.tube(chair,outline.map(v=>[v.x,v.y+.54,.155] as V),.007,piping,true);
 const seat=upholsteredPanel(d,chair,[0,-.38,-.77],3.20,1.72,.22,.21,cloth);
 seat.rotation.x=-Math.PI/2;seat.name='Seat facing the desk';
 for(const sign of [-1,1]){
  const x=sign*1.48;
  d.tube(chair,[[x,.29,.21],[x,.03,.245],[x,-.72,.245],[x,-.88,.07],[x,-.88,-1.18],[x,-.76,-1.35],[x,-.02,-1.35],[x,.09,-1.20],[x,.09,-.29]],.037,p.chrome);
  const armpad=upholsteredPanel(d,chair,[sign*1.73,.14,-.63],.32,1.17,.19,.15,cloth);
  armpad.rotation.x=-Math.PI/2;armpad.name=`${sign<0?'Left':'Right'} armrest toward desk`;
  d.rod(chair,[x,-.08,-.92],[sign*1.73,.025,-.92],.026,p.chrome);
  d.rod(chair,[x,-.09,-.30],[sign*1.73,.025,-.30],.026,p.chrome);
  d.cylinder(chair,[x,.25,.231],.035,.035,.015,p.darkMetal,[Math.PI/2,0,0],24);
  d.cylinder(chair,[x,.25,.244],.026,.026,.015,p.chrome,[Math.PI/2,0,0],24);
 }
 d.rod(chair,[-1.48,-.055,.247],[1.48,-.055,.247],.031,p.chrome);
 return chair;
}

function botanicalLeaves(d:AtelierGeometry){
 const n=20,m=12,v:number[]=[],uv:number[]=[],indices:number[]=[];
 for(let j=0;j<=n;j++){
  const t=j/n,width=.40*Math.pow(Math.sin(Math.PI*t),.72)*(1.22-.53*t);
  for(let i=0;i<=m;i++){
   const u=i/m*2-1;
   v.push(u*width,t,.095*(1-u*u)*Math.sin(Math.PI*t)+.11*t*t+.011*Math.cos(t*15)*Math.abs(u));uv.push(i/m,t);
  }
 }
 for(let j=0;j<n;j++)for(let i=0;i<m;i++){const a=j*(m+1)+i,b=a+m+1;indices.push(a,a+1,b,a+1,b+1,b);}
 const geo=d.own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
 const texture=d.canvas((c,w,h)=>{
  const grad=c.createLinearGradient(0,0,w,0);grad.addColorStop(0,'#46612b');grad.addColorStop(.48,'#617c38');grad.addColorStop(.52,'#6b8841');grad.addColorStop(1,'#425e2a');c.fillStyle=grad;c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(174,187,107,.34)';c.lineWidth=2;c.beginPath();c.moveTo(w/2,0);c.lineTo(w/2,h);c.stroke();
  for(let j=1;j<8;j++)for(const s of [-1,1]){c.lineWidth=.8;c.strokeStyle='rgba(143,165,79,.25)';c.beginPath();c.moveTo(w/2,h*j/9);c.quadraticCurveTo(w/2+s*w*.18,h*(j-.4)/9,w/2+s*w*.4,h*(j-1.45)/9);c.stroke();}
 },256,512);
 const mat=d.physical('#ffffff',{map:texture,roughness:.55,side:T.DoubleSide,clearcoat:.20,clearcoatRoughness:.55});return {geo,mat};
}

function replacePlants(d:AtelierGeometry,root:T.Object3D,p:Palette){
 const targets:T.Group[]=[];root.traverse(o=>{if(o instanceof T.Group&&['Trailing pothos','Ceramic planter'].includes(o.name))targets.push(o);});
 const {geo,mat}=botanicalLeaves(d);
 targets.forEach((g,index)=>{
  const trailing=g.name==='Trailing pothos',large=trailing&&index===0;
  g.clear();g.name=trailing?'Detailed trailing pothos':'Detailed potted foliage';
  const mottled=d.canvas((c,w,h)=>{c.fillStyle='#e6e1d5';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){c.fillStyle=['#a79c86','#c2b9a4','#d0c7b7'][i%3];c.beginPath();c.ellipse(d.rnd()*w,d.rnd()*h,1+d.rnd()*1.8,.8+d.rnd(),d.rnd()*3,0,7);c.fill();}},256,256);
  const potMat=trailing&&!large?d.physical('#ffffff',{map:mottled,roughness:.57,clearcoat:.06}):p.ceramic;
  const radius=large?.265:.232,height=large?.48:.41;
  d.lathe(g,[0,0,0],[[.001,.013],[radius*.76,.013],[radius*.88,.037],[radius,height-.016],[radius*.988,height],[radius*.85,height],[radius*.825,height-.035],[radius*.71,.05],[.001,.05]],potMat);
  d.cylinder(g,[0,height-.030,0],radius*.84,radius*.84,.013,p.soil);
  function leaf(pos:V,length:number,angle:number,tilt:number,twist:number){const l=d.mesh(g,geo,mat,pos,[tilt,twist,angle]);l.scale.set(length,length,length);return l;}
  const count=large?28:trailing?24:13;
  for(let i=0;i<count;i++){
   const a=i*2.39996+index*.78,r=.12+(i%5)*.066,tip:V=[Math.cos(a)*r,height+.07+(i%4)*.095,Math.sin(a)*r+.04];
   const length=large?.35+(i%4)*.035:.29+(i%4)*.027;
   d.tube(g,[[0,height-.02,0],[tip[0]*.6,height+.16,tip[2]*.55],tip],.007,p.stem);
   leaf(tip,length,-Math.cos(a)*1.04,(i%5-2)*.22,(i%7-3)*.15);
  }
  if(trailing){
   const drop=large?2.53:.89;
   for(let k=0;k<(large?5:3);k++){
    const x=-.23-k*.095,phase=k*.83;
    const pts:V[]=[[0,height-.01,0],[x,height+.08,.23],[x-.05,.13,.44],[x+.07*Math.sin(phase),-drop*.37,.48],[x-.12*Math.sin(phase+1),-drop*.70,.53],[x+.10*Math.cos(phase),-drop,.44]];
    d.tube(g,pts,.009,p.stem);const curve=new T.CatmullRomCurve3(pts.map(v=>new T.Vector3(...v))),count=large?14:6;
    for(let i=1;i<count;i++){
     const t=i/count,q=curve.getPoint(t),sign=(i+k)%2?1:-1,tip:V=[q.x+sign*.040,q.y-.045,q.z+.030];
     d.rod(g,[q.x,q.y,q.z],tip,.006,p.stem);
     leaf(tip,(large?.32:.27)*(1-.29*t),sign*(1.43+.28*Math.sin(i+k)),.08+(k%3-1)*.13,sign*.14);
    }
   }
  }
 });
}

function refineCamera(d:AtelierGeometry,root:T.Object3D,p:Palette){
 let camera:T.Object3D|undefined;root.traverse(o=>{if(o.name==='Rangefinder camera')camera=o;});if(!camera)return;
 for(const s of [-1,1]){
  d.torus(camera,[s*.56,.43,0],.055,.012,p.chrome,[0,Math.PI/2,0]);
  for(const y of [.09,.60])d.cylinder(camera,[s*.454,y,.21],.010,.010,.009,p.darkMetal,[Math.PI/2,0,0],12);
 }
 for(let i=0;i<30;i++){const a=i/30*Math.PI*2;d.box(camera,[.12+Math.cos(a)*.265,.325+Math.sin(a)*.265,.475],[.008,.021,.008],p.black,.002,[0,0,a-Math.PI/2]);}
 const ringMap=d.canvas((c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='#98a0a0';c.fillStyle='#b6bdb8';c.textAlign='center';c.font='14px Arial';for(let i=0;i<8;i++){const a=i*Math.PI/4;c.save();c.translate(w/2,h/2);c.rotate(a);c.fillText(['35','50','1.8','2.8','4','5.6','8','16'][i],0,-w*.42);c.restore();}},256,256);
 const label=d.mat('#ffffff',.6,0,{map:ringMap,transparent:true,depthWrite:false});d.roundedPlane(camera,[.12,.325,.520],.48,.48,.235,label).castShadow=false;
}

/** Fine physical details. No extra slogans or top-level category labels. */
export function applyStudioRefinement(d:AtelierGeometry,root:T.Group,furniture:T.Group,zones:Record<ZoneId,Zone>,p:Palette){
 furniture.getObjectByName('Upholstered cantilever chair')?.removeFromParent();
 const chair=makeRearViewChair(d,furniture,p);root.userData.chair=chair.userData;
 replacePlants(d,root,p);refineCamera(d,root,p);
 const moonMap=d.canvas((c,w,h)=>{
  c.fillStyle='#f6e5bb';c.fillRect(0,0,w,h);
  for(let i=0;i<100;i++){const x=d.rnd()*w,y=d.rnd()*h,r=3+d.rnd()*20,grad=c.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,'rgba(149,135,109,.19)');grad.addColorStop(.65,'rgba(188,168,130,.12)');grad.addColorStop(1,'rgba(246,229,187,0)');c.fillStyle=grad;c.fillRect(x-r,y-r,2*r,2*r);}
 },512,256);
 for(const material of d.materials){if(material instanceof T.MeshStandardMaterial&&material.emissiveIntensity===.6){material.map=moonMap;material.emissiveMap=moonMap;material.bumpMap=moonMap;material.bumpScale=.007;material.emissiveIntensity=.85;material.needsUpdate=true;}}
 const tv=root.getObjectByName('CRT enclosure and optics');if(tv){for(const [x,y] of [[-1.21,.62],[1.21,.62],[-1.21,-.6],[1.21,-.6]])d.cylinder(tv,[x,y,.183],.011,.011,.008,p.seam,[Math.PI/2,0,0],12);}
 const lightMap=d.canvas((c,w,h)=>{
  c.fillStyle='#000000';c.fillRect(0,0,w,h);c.save();c.translate(w/2,h/2);c.rotate(-.20);
  for(let y=-h;y<h;y+=48){const band=c.createLinearGradient(0,y,0,y+30);band.addColorStop(0,'#060606');band.addColorStop(.22,'#adadad');band.addColorStop(.78,'#adadad');band.addColorStop(1,'#060606');c.fillStyle=band;c.fillRect(-w,y,w*2,30);}c.restore();
 },512,512);
 const sun=new T.SpotLight('#fff1d5',30,18,.53,.75,2);sun.name='Filtered window light';sun.map=lightMap;sun.position.set(8,6.8,4);sun.target.position.set(3.0,2.2,-.7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-.0002;sun.shadow.normalBias=.02;root.add(sun,sun.target);
 for(const z of Object.values(zones))z.glow.emissiveIntensity=.42;
}
