import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
export type V = [number, number, number];
export type ZoneId = 'writing' | 'photography' | 'aigc' | 'video';
export type Zone = { group:T.Group; glow:T.MeshStandardMaterial; anchor:T.Vector3; hit:T.Mesh };

/** Authored solids, curved surfaces and reusable material resources. */
export class AtelierGeometry {
 geometries=new Set<T.BufferGeometry>(); materials=new Set<T.Material>(); textures=new Set<T.Texture>();
 private cache=new Map<string,T.BufferGeometry>(); private randomState=4129; private grain?:T.CanvasTexture;
 rnd(){this.randomState=(1664525*this.randomState+1013904223)>>>0;return this.randomState/4294967296;}
 own<G extends T.BufferGeometry>(g:G):G{this.geometries.add(g);return g;}
 mat(color:string,roughness=.55,metalness=0,extra:T.MeshStandardMaterialParameters={}){const m=new T.MeshStandardMaterial({color,roughness,metalness,...extra});this.materials.add(m);return m;}
 physical(color:string,extra:T.MeshPhysicalMaterialParameters={}){const m=new T.MeshPhysicalMaterial({color,roughness:.4,clearcoat:.12,...extra});this.materials.add(m);return m;}
 mesh(parent:T.Object3D,geo:T.BufferGeometry,mat:T.Material,pos:V=[0,0,0],rotation:V=[0,0,0]){
  const mesh=new T.Mesh(geo,mat);mesh.position.set(...pos);mesh.rotation.set(...rotation);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
 }
 box(parent:T.Object3D,pos:V,size:V,mat:T.Material,r=.035,rotation:V=[0,0,0]){
  const radius=Math.max(.00001,Math.min(r,Math.min(...size)*.46));const key=`box:${size.join(':')}:${radius}`;
  let geo=this.cache.get(key);if(!geo){geo=this.own(new RoundedBoxGeometry(...size,3,radius));this.cache.set(key,geo);}return this.mesh(parent,geo,mat,pos,rotation);
 }
 ball(parent:T.Object3D,pos:V,scale:V,mat:T.Material){let geo=this.cache.get('sphere');if(!geo){geo=this.own(new T.SphereGeometry(1,24,16));this.cache.set('sphere',geo);}const m=this.mesh(parent,geo,mat,pos);m.scale.set(...scale);return m;}
 cylinder(parent:T.Object3D,pos:V,r1:number,r2:number,height:number,mat:T.Material,rotation:V=[0,0,0],segments=32){const key=`c:${r1}:${r2}:${height}:${segments}`;let geo=this.cache.get(key);if(!geo){geo=this.own(new T.CylinderGeometry(r1,r2,height,segments));this.cache.set(key,geo);}return this.mesh(parent,geo,mat,pos,rotation);}
 torus(parent:T.Object3D,pos:V,r:number,thickness:number,mat:T.Material,rotation:V=[0,0,0],arc=Math.PI*2){return this.mesh(parent,this.own(new T.TorusGeometry(r,thickness,8,64,arc)),mat,pos,rotation);}
 tube(parent:T.Object3D,points:V[],radius:number,mat:T.Material,closed=false){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed);return this.mesh(parent,this.own(new T.TubeGeometry(curve,Math.max(12,points.length*6),radius,6,closed)),mat);}
 rod(parent:T.Object3D,a:V,b:V,r:number,mat:T.Material){const av=new T.Vector3(...a),bv=new T.Vector3(...b),direction=bv.clone().sub(av);const m=this.cylinder(parent,av.clone().add(bv).multiplyScalar(.5).toArray() as V,r,r,direction.length(),mat,[0,0,0],12);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return m;}
 lathe(parent:T.Object3D,pos:V,profile:[number,number][],mat:T.Material){return this.mesh(parent,this.own(new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),48)),mat,pos);}
 rect(w:number,h:number,r:number):T.Shape{
  const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
 }
 frame(parent:T.Object3D,pos:V,w:number,h:number,depth:number,border:number,mat:T.Material,r=.15){
  const shape=this.rect(w,h,r),hole=this.rect(w-border*2,h-border*2,Math.max(.025,r-border*.5));shape.holes.push(new T.Path(hole.getPoints(12).reverse()));
  const geo=this.own(new T.ExtrudeGeometry(shape,{depth,steps:1,bevelEnabled:true,bevelSegments:3,bevelThickness:Math.min(.018,depth*.3),bevelSize:Math.min(.018,border*.25),curveSegments:10}));geo.translate(0,0,-depth/2);return this.mesh(parent,geo,mat,pos);
 }
 roundedPlane(parent:T.Object3D,pos:V,w:number,h:number,r:number,mat:T.Material){const geo=this.own(new T.ShapeGeometry(this.rect(w,h,r),16));const p=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/w+.5,p.getY(i)/h+.5);return this.mesh(parent,geo,mat,pos);}
 canvas(draw:(c:CanvasRenderingContext2D,w:number,h:number)=>void,w=256,h=256){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D is unavailable');draw(ctx,w,h);const map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;map.anisotropy=4;this.textures.add(map);return map;}
 surface(){if(this.grain)return this.grain;this.grain=this.canvas((c,w,h)=>{c.fillStyle='#bbbbbb';c.fillRect(0,0,w,h);for(let i=0;i<9000;i++){const v=145+Math.floor(this.rnd()*60);c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(this.rnd()*w,this.rnd()*h,1,1);}});this.grain.colorSpace=T.NoColorSpace;this.grain.wrapS=this.grain.wrapT=T.RepeatWrapping;this.grain.repeat.set(3,3);return this.grain;}
 photoMaterial(texture:T.Texture,aspect:number){const map=texture.clone();const image=map.image as {width:number;height:number};const source=image.width/image.height;map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;if(source>aspect){map.repeat.x=aspect/source;map.offset.x=(1-map.repeat.x)/2;}else{map.repeat.y=source/aspect;map.offset.y=(1-map.repeat.y)/2;}map.needsUpdate=true;this.textures.add(map);return this.mat('#ffffff',.7,0,{map,emissive:'#ffffff',emissiveMap:map,emissiveIntensity:.12});}
 /** Batch static geometry per material, preserving interactive zone boundaries. */
 batch(group:T.Group){
  group.updateMatrixWorld(true);const inv=group.matrixWorld.clone().invert(),buckets=new Map<T.Material,T.Mesh[]>();
  group.traverse(o=>{if(o instanceof T.Mesh&&!o.userData.noBatch&&!Array.isArray(o.material)){const a=buckets.get(o.material)||[];a.push(o);buckets.set(o.material,a);}});
  for(const [mat,meshes] of buckets){if(meshes.length<3)continue;
   const cloned=meshes.map(m=>{const g=m.geometry.clone();g.applyMatrix4(inv.clone().multiply(m.matrixWorld));if(!g.index)return g;const flat=g.toNonIndexed();g.dispose();return flat;});
   const merged=mergeGeometries(cloned,false);cloned.forEach(g=>g.dispose());if(!merged)continue;this.own(merged);meshes.forEach(m=>m.removeFromParent());const mesh=this.mesh(group,merged,mat);mesh.name=`surface:${mat.name||mat.type}`;
  }
 }
 dispose(){this.geometries.forEach(g=>g.dispose());this.materials.forEach(m=>m.dispose());this.textures.forEach(t=>t.dispose());}
}
