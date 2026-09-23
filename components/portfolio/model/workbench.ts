import * as T from 'three';
import { AtelierGeometry, type V, type Zone, type ZoneId } from './atelier-geometry';

export const WORK_IMAGES = [
 '/assets/photos/portrait/portrait-01.jpeg',
 '/assets/photos/happy-mahua/still-02.jpeg',
 '/assets/photos/yu-chaoying-concert/concert-03.jpeg',
 '/assets/photos/portrait/portrait-06.jpeg',
 '/assets/photos/ziroom-campaign/campaign-02.jpeg',
 '/assets/photos/meituan-product/product-02.jpeg',
 '/assets/projects/red-leaf/gameplay-scene-hires.png',
];

export function createWorkbench(images:T.Texture[]) {
 const d=new AtelierGeometry(),root=new T.Group();root.name='Yexinmei / authored creative workbench';
 const furniture=new T.Group();furniture.name='Desk, cabinetry and studio furniture';root.add(furniture);
 const grain=d.surface();
 const p={
  ivory:d.physical('#eee6d9',{roughness:.37,clearcoat:.22,bumpMap:grain,bumpScale:.008}),
  edge:d.mat('#f8f3e9',.37,.06),
  blue:d.physical('#b4c9d8',{roughness:.43,clearcoat:.16}),
  blueDark:d.mat('#9cabb5',.65),
  back:d.mat('#d3d4d0',.9,0,{bumpMap:grain,bumpScale:.012}),
  board:d.mat('#e1d9c9',.85,0,{bumpMap:grain,bumpScale:.014}),
  paper:d.mat('#f4f0e6',.87,0,{bumpMap:grain,bumpScale:.004}),
  pages:d.mat('#e7dfcf',.86),
  ceramic:d.physical('#eee9df',{roughness:.3,clearcoat:.24,bumpMap:grain,bumpScale:.007}),
  metal:d.mat('#bec2c5',.22,.85),
  chrome:d.mat('#ccd0d3',.17,.95),
  darkMetal:d.mat('#4b5155',.32,.75),
  red:d.physical('#ac4d41',{roughness:.32,clearcoat:.35}),
  black:d.mat('#252729',.63,0,{bumpMap:grain,bumpScale:.009}),
  leather:d.mat('#252724',.8,0,{bumpMap:grain,bumpScale:.018}),
  leaf:d.mat('#52672a',.58,0,{side:T.DoubleSide}),
  leaf2:d.mat('#70833c',.58,0,{side:T.DoubleSide}),
  leaf3:d.mat('#86944c',.65,0,{side:T.DoubleSide}),
  stem:d.mat('#6a7541',.85),
  soil:d.mat('#51483a',.95),
  seam:d.mat('#c7bbae',.83),
  glass:d.physical('#dbe6e8',{transparent:true,opacity:.20,roughness:.12,metalness:.05,clearcoat:1,depthWrite:false}),
 };
 Object.entries(p).forEach(([name,m])=>m.name=name);
 const zones={} as Record<ZoneId,Zone>;
 const group=(parent:T.Object3D,pos:V=[0,0,0],rotation:V=[0,0,0])=>{const g=new T.Group();g.position.set(...pos);g.rotation.set(...rotation);parent.add(g);return g;};
 const plane=(g:T.Object3D,pos:V,w:number,h:number,mat:T.Material)=>d.mesh(g,d.own(new T.PlaneGeometry(w,h)),mat,pos);

 function alcove(id:ZoneId,cx:number,cy:number,w:number,h:number,back:T.Material) {
  const g=group(root,[cx,cy,0]);g.name=id;g.userData.zone=id;
  d.box(g,[0,0,-.73],[w,h,.14],back,.09);
  d.box(g,[-w/2+.055,0,-.24],[.11,h,.97],p.ivory,.035);
  d.box(g,[ w/2-.055,0,-.24],[.11,h,.97],p.ivory,.035);
  d.box(g,[0,h/2-.055,-.24],[w,.11,.97],p.ivory,.035);
  d.box(g,[0,-h/2+.055,-.24],[w,.11,.97],p.ivory,.035);
  d.frame(g,[0,0,.237],w,h,.075,.074,p.edge,.145);
  const glow=d.mat('#fff0d7',.45,0,{emissive:'#ffdaac',emissiveIntensity:.23,toneMapped:false});
  const rim=d.frame(g,[0,0,.284],w+.018,h+.018,.012,.012,glow,.16);rim.userData.noBatch=true;rim.castShadow=false;
  d.cylinder(g,[-w/2+.17,h/2-.17,.34],.043,.047,.045,p.red,[Math.PI/2,0,0],24);
  const hit=d.mesh(g,d.own(new T.BoxGeometry(w,h,1.65)),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),[0,0,.25]);
  d.materials.add(hit.material);hit.castShadow=false;hit.receiveShadow=false;hit.userData.noBatch=true;hit.userData.zone=id;
  zones[id]={group:g,glow,anchor:new T.Vector3(cx,cy,.8),hit};
  return g;
 }
 function shelf(g:T.Object3D,x:number,y:number,w:number,depth=.84) {
  d.box(g,[x,y,-.04],[w,.095,depth],p.ivory,.035);
  d.box(g,[x,y-.048,.34],[w-.06,.018,.025],p.edge,.007);
 }
 function spine(title:string,color:string) {
  return d.canvas((c,w,h)=>{
   c.fillStyle=color;c.fillRect(0,0,w,h);c.strokeStyle='rgba(75,64,52,.13)';c.lineWidth=2;c.strokeRect(12,12,w-24,h-24);
   c.fillStyle='#635b50';c.textAlign='center';c.font='20px Georgia';c.save();c.translate(w/2,h/2);c.rotate(-Math.PI/2);c.fillText(title,0,6);c.restore();
   c.fillStyle='rgba(75,64,52,.35)';c.fillRect(w*.3,h*.08,w*.4,2);c.fillRect(w*.3,h*.9,w*.4,2);
  },96,512);
 }
 function book(parent:T.Object3D,pos:V,w:number,h:number,depth:number,color:string,title:string,lean=0) {
  const g=group(parent,pos,[0,0,lean]);g.name='Bound volume';
  const cover=d.mat(color,.82,0,{bumpMap:grain,bumpScale:.006});
  d.box(g,[0,h/2,0],[w-.032,h-.036,depth-.026],p.pages,.008);
  d.box(g,[-w/2+.008,h/2,0],[.019,h,depth],cover,.007);
  d.box(g,[ w/2-.008,h/2,0],[.019,h,depth],cover,.007);
  d.box(g,[0,h/2,depth/2-.011],[w,h,.028],cover,.009);
  const map=spine(title,color);const label=d.mat('#ffffff',.9,0,{map});
  plane(g,[0,h/2,depth/2+.005],w-.012,h-.035,label);
  for(let i=1;i<5;i++)d.box(g,[0,h-.017,depth*(i/5-.5)],[w-.038,.003,.003],p.seam,.001);
  return g;
 }
 function flatBook(parent:T.Object3D,pos:V,w:number,depth:number,color:string,angle=0) {
  const g=group(parent,pos,[0,angle,0]);const cover=d.mat(color,.73);
  d.box(g,[0,.075,0],[w-.036,.112,depth-.03],p.pages,.008);
  d.box(g,[0,.013,0],[w,.021,depth],cover,.009);d.box(g,[0,.141,0],[w,.021,depth],cover,.009);
  d.box(g,[0,.075,-depth/2+.006],[w,.145,.035],cover,.009);
  for(let i=0;i<8;i++)d.box(g,[0,.029+i*.013,depth/2-.012],[w-.06,.002,.002],p.seam,.0008);
  return g;
 }
 // Curved leaf blades: tapered outline, cupped surface, raised midrib and branching veins.
 const leafGeo=(()=>{
  const nx=8,ny=16,v:number[]=[],uv:number[]=[],idx:number[]=[];
  for(let j=0;j<=ny;j++){const t=j/ny;const width=.43*Math.pow(Math.sin(Math.PI*t),.72)*(1.12-.3*t);
   for(let i=0;i<=nx;i++){const u=i/nx*2-1;v.push(u*width,t,.12*(1-u*u)*Math.sin(Math.PI*t)+.035*Math.sin(t*5)*u);uv.push(i/nx,t);}}
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+nx+1;idx.push(a,b,a+1,a+1,b,b+1);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return d.own(geo);
 })();
 function blade(parent:T.Object3D,pos:V,length:number,angle:number,tilt:number,n:number) {
  const g=group(parent,pos,[tilt,(n%5-2)*.18,angle]);g.scale.set(length*.93,length,length);
  const m=d.mesh(g,leafGeo,[p.leaf,p.leaf2,p.leaf3][n%3]);m.name='Cupped leaf';
  d.tube(g,[[0,0,.004],[0,.26,.088],[0,.57,.12],[0,.88,.035]],.006,p.stem);
  return g;
 }
 function plant(parent:T.Object3D,pos:V,s=1,trailing=false,seed=0) {
  const g=group(parent,pos);g.scale.setScalar(s);g.name=trailing?'Trailing pothos with modeled leaves':'Ceramic planter';
  d.lathe(g,[0,0,0],[[.001,.008],[.165,.008],[.186,.025],[.218,.37],[.22,.405],[.213,.419],[.183,.419],[.175,.395],[.15,.035],[.001,.035]],p.ceramic);
  d.cylinder(g,[0,.39,0],.18,.18,.014,p.soil);
  for(let i=0;i<16;i++){
   const a=i*2.399+seed,r=.08+(i%4)*.085,height=.53+(i%5)*.10;
   const end:V=[Math.cos(a)*r,height,Math.sin(a)*r];
   d.tube(g,[[0,.35,0],[end[0]*.4,.53,end[2]*.5],end],.009,p.stem);
   blade(g,end,.34+(i%3)*.055,-a*.6+(i%2?.4:-.4),Math.sin(a)*.7,i);
  }
  if(trailing){
   for(let v=0;v<3;v++){
    const pts:V[]=[[0,.5,0],[-.23-v*.09,.47,.28],[-.43-v*.09,.06,.35],[-.44+v*.13,-.55,.32],[-.51+v*.12,-1.17,.41],[-.42+v*.1,-1.72-v*.14,.35]];
    d.tube(g,pts,.011,p.stem);const curve=new T.CatmullRomCurve3(pts.map(a=>new T.Vector3(...a)));
    for(let k=1;k<=13;k++){const t=k/14,q=curve.getPoint(t);const sign=k%2?1:-1;
     blade(g,[q.x,q.y,q.z+.015],.31-.08*t,sign*(.85+.3*Math.sin(k)),.08+Math.sin(k)*.3,k+v);
    }
   }
  }
  return g;
 }
 function bear(parent:T.Object3D,pos:V,s=1) {
  const g=group(parent,pos);g.scale.setScalar(s);g.name='Glazed ceramic bear';
  d.ball(g,[0,.29,0],[.195,.235,.153],p.ceramic);d.ball(g,[0,.58,.015],[.181,.164,.146],p.ceramic);
  for(const sign of [-1,1]){
   d.ball(g,[sign*.136,.718,.008],[.067,.068,.047],p.ceramic);
   d.ball(g,[sign*.137,.721,.049],[.036,.037,.013],p.paper);
   d.ball(g,[sign*.203,.34,.018],[.063,.128,.066],p.ceramic);
   d.ball(g,[sign*.111,.102,.052],[.081,.086,.096],p.ceramic);
   d.ball(g,[sign*.061,.61,.155],[.013,.017,.009],p.black);
  }
  d.ball(g,[0,.556,.158],[.075,.052,.024],p.paper);d.ball(g,[0,.568,.184],[.018,.013,.009],p.black);
  d.tube(g,[[0,.558,.181],[0,.542,.182],[-.013,.533,.18]],.003,p.black);
  d.tube(g,[[0,.542,.182],[.013,.533,.18]],.003,p.black);
  return g;
 }
 function print(parent:T.Object3D,pos:V,w:number,h:number,texture:T.Texture,angle=0) {
  const g=group(parent,pos,[0,0,angle]);g.name='Archival print';
  d.box(g,[0,-.024,0],[w+.085,h+.135,.021],p.paper,.008);
  plane(g,[0,.012,.016],w,h,d.photoMaterial(texture,w/h));
  return g;
 }
 function pin(parent:T.Object3D,pos:V,red=false) {
  d.cylinder(parent,pos,.04,.046,.039,red?p.red:p.edge,[Math.PI/2,0,0],24);
 }
 function pencilCup(parent:T.Object3D,pos:V,s=1,glass=false) {
  const g=group(parent,pos);g.scale.setScalar(s);
  d.lathe(g,[0,0,0],[[.001,.008],[.14,.008],[.145,.42],[.138,.44],[.12,.44],[.119,.033],[.001,.033]],glass?p.glass:p.ceramic);
  for(let i=0;i<6;i++){
   const x=(i%3-1)*.065,z=(Math.floor(i/3)-.5)*.065;
   const a:V=[x,.06,z],b:V=[x+(i-2.5)*.035,.74+(i%3)*.08,z+.016];
   d.rod(g,a,b,.013,i===2?p.red:i===4?p.metal:p.black);
   d.cylinder(g,[b[0],b[1]+.014,b[2]],.002,.013,.06,p.pages,[0,0,-.06],12);
  }
 }
 function camera(parent:T.Object3D,pos:V) {
  const g=group(parent,pos);g.name='Detailed rangefinder camera';
  d.box(g,[0,.33,0],[1.05,.65,.39],p.leather,.075);
  d.box(g,[0,.617,0],[1.05,.095,.41],p.metal,.025);
  d.box(g,[0,.067,0],[1.05,.06,.41],p.metal,.019);
  d.box(g,[-.455,.32,.013],[.155,.5,.42],p.black,.045);
  d.box(g,[-.32,.566,.222],[.2,.099,.016],p.darkMetal,.009);
  d.box(g,[-.32,.566,.237],[.142,.057,.008],p.glass,.008);
  d.cylinder(g,[-.32,.696,-.04],.105,.105,.065,p.darkMetal);
  d.cylinder(g,[.36,.69,0],.073,.073,.078,p.metal);
  d.cylinder(g,[.16,.693,-.025],.034,.034,.048,p.red);
  const cx=.12,cy=.325;
  d.cylinder(g,[cx,cy,.266],.324,.327,.15,p.darkMetal,[Math.PI/2,0,0],48);
  for(let i=0;i<7;i++)d.cylinder(g,[cx,cy,.333+i*.025],.295-i*.003,.295-i*.003,.017,i%2?p.black:p.darkMetal,[Math.PI/2,0,0],48);
  d.torus(g,[cx,cy,.51],.258,.023,p.metal);
  d.cylinder(g,[cx,cy,.505],.235,.235,.039,p.black,[Math.PI/2,0,0],48);
  d.torus(g,[cx,cy,.53],.206,.014,p.black);
  const lens=d.physical('#172832',{roughness:.09,metalness:.3,clearcoat:1});
  d.ball(g,[cx,cy,.535],[.185,.185,.028],lens);
  d.torus(g,[cx,cy,.564],.104,.006,p.darkMetal);
  for(let i=0;i<36;i++){
   const a=i*Math.PI/18;const v:V=[cx+Math.cos(a)*.313,cy+Math.sin(a)*.313,.296];
   d.box(g,v,[.011,.027,.023],p.black,.002,[0,0,a-Math.PI/2]);
  }
  d.cylinder(g,[.315,.556,.221],.031,.031,.025,p.red,[Math.PI/2,0,0],20);
 }
 function film(parent:T.Object3D,x:number,y:number,z:number,color:string) {
  const mat=d.mat(color,.45,.08);
  d.cylinder(parent,[x,y+.18,z],.065,.065,.33,mat);
  d.cylinder(parent,[x,y+.35,z],.072,.072,.028,p.black);
  d.cylinder(parent,[x,y+.015,z],.07,.07,.025,p.darkMetal);
  d.box(parent,[x,y+.19,z+.065],[.069,.145,.005],p.paper,.002);
 }
 function shade(parent:T.Object3D,pos:V,r:number,mat:T.Material) {
  const g=group(parent,pos);
  d.lathe(g,[0,0,0],[[r*.12,r*.85],[r*.19,r*.82],[r*.42,r*.70],[r*.70,r*.47],[r*.9,r*.19],[r,.045],[r,.015],[r*.956,.012],[r*.88,r*.18],[r*.66,r*.44],[r*.38,r*.65],[r*.12,r*.74]],mat);
  const glow=d.mat('#fff6dc',.4,0,{emissive:'#ffe7b4',emissiveIntensity:1.4});
  d.cylinder(g,[0,.022,0],r*.88,r*.88,.016,glow);
  d.torus(g,[0,.025,0],r*.96,.013,p.edge,[Math.PI/2,0,0]);
  return g;
 }
 function deskLamp() {
  const g=group(furniture,[-5.63,0,.87]);g.name='Articulated task light';
  d.cylinder(g,[0,.045,0],.29,.31,.09,p.ivory);
  const a:V=[0,.14,0],b:V=[-.37,1.13,-.04],c:V=[.26,1.67,-.04];
  for(const z of [-.043,.043]){
   d.rod(g,[a[0]-.038,a[1],z],[b[0]-.038,b[1],z],.019,p.ivory);
   d.rod(g,[a[0]+.038,a[1],z],[b[0]+.038,b[1],z],.019,p.ivory);
   d.rod(g,[b[0],b[1]-.035,z],[c[0],c[1]-.035,z],.019,p.ivory);
   d.rod(g,[b[0],b[1]+.035,z],[c[0],c[1]+.035,z],.019,p.ivory);
  }
  for(const q of [a,b,c]){
   d.cylinder(g,q,.08,.08,.15,p.edge,[Math.PI/2,0,0],24);
   d.cylinder(g,[q[0],q[1],.092],.027,.027,.013,p.metal,[Math.PI/2,0,0],20);
  }
  shade(g,[.45,1.43,.02],.40,p.ivory);
 }
 // A continuous, physically supported desk; the back wall extends beyond the camera frustum.
 const wall=d.mat('#edeae4',.96);wall.name='warm plaster';
 const wallMesh=plane(furniture,[0,8,-1.12],80,34,wall);wallMesh.castShadow=false;
 const floor=d.mesh(furniture,d.own(new T.PlaneGeometry(120,120)),d.mat('#e0dfda',.96),[0,-2.22,0],[-Math.PI/2,0,0]);floor.castShadow=false;
 d.box(furniture,[0,-.115,.50],[12.3,.23,2.72],p.ivory,.10);
 d.box(furniture,[0,-.305,.46],[12.03,.16,2.57],p.blue,.045);
 d.box(furniture,[-5.66,-1.25,-.30],[.16,1.86,.58],p.ivory,.04);
 d.box(furniture,[-5.66,-2.17,.35],[.5,.06,1.65],p.blue,.023);
 d.box(furniture,[4.28,-1.25,.38],[2.58,1.83,2.23],p.blue,.12);
 for(let i=0;i<2;i++){
  const y=-.8-i*.83;
  d.box(furniture,[4.28,y,1.531],[2.4,.758,.062],p.blue,.048);
  d.frame(furniture,[4.28,y,1.568],2.35,.716,.012,.013,p.edge,.048);
  d.cylinder(furniture,[4.28,y+.11,1.63],.074,.079,.089,p.red,[Math.PI/2,0,0],32);
 }
 d.box(furniture,[0,.13,-.49],[8.75,.24,.65],p.ivory,.055);

 // LEFT: editorial shelf, individual bound books and a genuine trailing plant silhouette.
 const left=alcove('writing',-4.05,2.825,3.16,4.65,p.back);
 shelf(left,0,.60,2.94);shelf(left,0,-.92,2.94);shelf(left,0,-2.15,2.94);
 shelf(left,-.77,1.36,1.32,.74);
 plant(left,[-.79,1.42,.00],.92,true,1);
 let bx=-.11;
 for(const [i,w] of [.21,.24,.18,.23].entries()){
  book(left,[bx,.66,.025],w,1.3-i*.07,.55,['#eee9de','#d5c9ba','#e6dfd2','#f3ebdf'][i],['NOTES','PHOTOGRAPHY','ARCHIVE','01'][i],i===2?-.035:0);bx+=w+.027;
 }
 bear(left,[1.13,.66,.02],.85);
 let mx=-1.21;
 for(let i=0;i<6;i++){const w=.16+(i%2)*.05;book(left,[mx,-.86,.035],w,1.10+(i%3)*.065,.54,['#e6ddce','#d8cfbf','#f1ece2'][i%3],['02','IMAGES','NOTES'][i%3],i===5?-.055:0);mx+=w+.032;}
 const frame=group(left,[.52,-.45,.29],[0,-.04,0]);d.box(frame,[0,0,0],[.55,.76,.048],p.edge,.019);print(frame,[0,0,.034],.46,.63,images[3]);
 flatBook(left,[.62,-.86,.10],.87,.56,'#e2d6c4');
 const orbmat=d.mat('#fff1ce',.78,0,{emissive:'#ffdca0',emissiveIntensity:.6,bumpMap:grain,bumpScale:.05});
 d.ball(left,[1.1,-.43,.20],[.235,.235,.235],orbmat);d.box(left,[1.1,-.735,.18],[.49,.14,.46],p.ceramic,.025);
 d.box(left,[-.86,-1.84,.045],[1.05,.52,.59],p.ivory,.055);d.box(left,[-.86,-1.556,.045],[1.085,.052,.62],p.edge,.025);
 d.box(left,[-.86,-1.679,.35],[.32,.041,.012],p.black,.012);
 flatBook(left,[.27,-2.10,.07],1.14,.59,'#d5c8b8');flatBook(left,[.27,-1.935,.07],1.03,.57,'#f0e8dc');
 plant(left,[1.08,-2.10,.09],.74,true,4);

 // CENTER: a single perforated board; pictures have individual paper edges and magnets.
 const center=alcove('photography',-.23,2.825,4.16,4.65,p.board);
 const holeGeo=d.own(new T.CircleGeometry(.0125,10));const holes=new T.InstancedMesh(holeGeo,d.mat('#928779',.95),18*21);
 holes.position.z=-.648;const matrix=new T.Matrix4();let hi=0;
 for(let y=0;y<21;y++)for(let x=0;x<18;x++){matrix.makeTranslation(-1.86+x*.218,2.12-y*.214,0);holes.setMatrixAt(hi++,matrix);}
 holes.instanceMatrix.needsUpdate=true;center.add(holes);holes.userData.noBatch=true;
 const papers:[number,number,number,number,number,number][]=[[-1.19,1.14,.90,.82,-.055,0],[-.05,1.4,1.20,.91,.025,1],[1.20,1.05,1.0,.86,-.045,2],[-1.06,.05,.96,1.02,.06,3],[.16,.17,1.04,.81,-.045,4],[1.17,-.1,.85,1.07,-.10,5]];
 for(const [x,y,w,h,a,ix] of papers){print(center,[x,y,-.545+ix*.007],w,h,images[ix],a);pin(center,[x+.015,y+h/2+.052,-.487+ix*.007],ix%2===0);}
 shelf(center,0,-2.12,3.94,.90);
 plant(center,[-1.64,-2.06,.025],.64,false,3);camera(center,[-.33,-2.06,.05]);
 for(let i=0;i<4;i++)film(center,.54+i*.18,-2.06,.08,['#ccc9c1','#242628','#c99740','#323434'][i]);
 pencilCup(center,[1.55,-2.06,.08],.88);

 // TOP RIGHT: an open file rack with stepped side walls and separate printed sheets.
 const upper=alcove('aigc',3.99,3.845,3.35,2.61,p.blue);
 function art(index:number) {
  const map=d.canvas((c,w,h)=>{
   c.fillStyle=['#f0e8dc','#e7e5df','#eaeef0'][index%3];c.fillRect(0,0,w,h);
   const gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,['#c7846c','#85a6b8','#b78783'][index%3]);gr.addColorStop(1,['#eecba3','#d2e4e8','#e3c7bb'][index%3]);c.fillStyle=gr;c.beginPath();c.arc(w*.59,h*.40,w*.29,0,Math.PI*2);c.fill();
   c.fillStyle=['#7d93a0','#e2c1a8','#7996a6'][index%3];c.beginPath();c.moveTo(w*.11,h*.92);c.bezierCurveTo(w*.2,h*.32,w*.48,h*.54,w*.59,h*.92);c.fill();
   c.strokeStyle='rgba(81,87,86,.25)';c.lineWidth=2;c.beginPath();c.moveTo(w*.16,h*.82);c.bezierCurveTo(w*.35,h*.41,w*.51,h*.64,w*.82,h*.7);c.stroke();
  },384,512);return d.mat('#ffffff',.8,0,{map});
 }
 const artm=[art(0),art(1),art(2)];
 for(let i=0;i<4;i++){
  const g=group(upper,[-.53+i*.34,.10+i*.025,-.50+i*.12],[0,-.04,(i-1.5)*.04]);
  d.box(g,[0,0,0],[1.53,1.96,.025],p.paper,.008);plane(g,[0,0,.018],1.44,1.87,artm[i%3]);
 }
 d.box(upper,[.05,-1.04,-.10],[2.87,.075,.99],p.ivory,.025);
 for(const x of [-1.37,1.47])d.box(upper,[x,-.69,-.1],[.057,.7,.99],p.ivory,.02);
 const lip=new T.Shape();lip.moveTo(-1.37,-1.0);lip.lineTo(1.47,-1.0);lip.lineTo(1.47,-.50);lip.quadraticCurveTo(1.47,-.38,1.35,-.38);lip.lineTo(.9,-.38);lip.quadraticCurveTo(.82,-.38,.77,-.48);lip.lineTo(.56,-.69);lip.lineTo(-.26,-.69);lip.lineTo(-.45,-.50);lip.quadraticCurveTo(-.52,-.37,-.66,-.37);lip.lineTo(-1.24,-.37);lip.quadraticCurveTo(-1.37,-.37,-1.37,-.5);lip.closePath();
 const lg=d.own(new T.ExtrudeGeometry(lip,{depth:.057,bevelEnabled:true,bevelSegments:3,bevelSize:.023,bevelThickness:.018,curveSegments:10}));d.mesh(upper,lg,p.ivory,[0,0,.43]);
 for(let i=0;i<5;i++)book(upper,[-.12+i*.115,-.98,.15],.10,.97+(i%2)*.08,.45,i%2?'#d8cfbf':'#eee6d6','',0);
 const small=group(upper,[1.0,-.41,.40]);d.box(small,[0,0,0],[.56,.75,.021],p.paper,.007);plane(small,[0,0,.016],.47,.61,artm[1]);

 // BOTTOM RIGHT: deep-bodied CRT with glass screen, turned knobs, speaker slats and feet.
 const lower=alcove('video',3.99,1.484,3.35,1.99,p.blue);
 const tv=group(lower,[0,-.04,-.01]);tv.name='CRT enclosure and optics';
 d.box(tv,[0,0,-.20],[2.69,1.49,.75],p.ivory,.145);
 d.frame(tv,[-.265,.045,.239],2.07,1.263,.055,.064,p.blueDark,.13);
 d.box(tv,[-.265,.045,.267],[1.943,1.137,.041],p.black,.12);
 const screen=d.roundedPlane(tv,[-.265,.045,.301],1.84,1.04,.084,d.photoMaterial(images[6],1.84/1.04));screen.castShadow=false;
 d.roundedPlane(tv,[-.265,.045,.308],1.86,1.06,.087,p.glass).castShadow=false;
 const white=d.mat('#fff8e8',.4,0,{emissive:'#ffffff',emissiveIntensity:.3});
 d.torus(tv,[-.265,.045,.335],.18,.011,white);
 const tri=new T.Shape();tri.moveTo(-.045,-.08);tri.lineTo(.079,0);tri.lineTo(-.045,.08);tri.closePath();d.mesh(tv,d.own(new T.ShapeGeometry(tri)),white,[-.252,.045,.34]);
 for(let i=0;i<2;i++){
  const y=.44-i*.285;d.torus(tv,[1.035,y,.219],.103,.014,p.darkMetal);
  d.cylinder(tv,[1.035,y,.228],.083,.083,.07,p.ivory,[Math.PI/2,0,0]);
  d.box(tv,[1.035,y+.05,.268],[.012,.036,.008],p.darkMetal,.002);
 }
 for(let i=0;i<14;i++)d.box(tv,[1.03,-.17-i*.032,.216],[.28,.008,.011],p.blueDark,.003);
 for(const x of [-.85,.86])d.box(tv,[x,-.799,-.13],[.25,.14,.43],p.ivory,.052);
 plant(lower,[-1.39,-.92,.21],.46,false,5);

 // Desktop objects: restrained, materially different, and resting on the desktop.
 deskLamp();flatBook(furniture,[-4.48,.01,.78],1.88,.83,'#d1bfa9',-.025);flatBook(furniture,[-4.42,.179,.80],1.79,.78,'#f0e7d8',.012);
 pencilCup(furniture,[-3.04,.01,.88],.96,true);
 const pad=d.mat('#9baebb',.96,0,{bumpMap:grain,bumpScale:.005});
 d.box(furniture,[-.20,.020,.85],[4.81,.034,1.61],pad,.014);
 d.box(furniture,[-.51,.107,.86],[2.91,.105,1.40],p.metal,.045);
 d.box(furniture,[-.51,.180,.86],[2.89,.042,1.385],d.mat('#c9c5be',.35,.52),.018);
 d.box(furniture,[-.51,.099,1.569],[.33,.018,.014],p.darkMetal,.006);
 d.box(furniture,[-.51,.112,.186],[2.4,.06,.065],p.darkMetal,.024);
 const mouse=group(furniture,[1.66,.01,1.05],[0,-.18,0]);
 d.ball(mouse,[0,.067,0],[.18,.105,.27],p.ceramic);d.tube(mouse,[[0,.17,-.16],[0,.175,-.02]],.002,p.seam);
 d.box(mouse,[0,.172,-.053],[.038,.014,.063],p.blueDark,.006);
 const stand=group(furniture,[3.22,.015,.89]);
 d.box(stand,[0,.043,0],[.69,.08,.54],p.ivory,.031);d.box(stand,[0,.205,-.11],[.13,.33,.10],p.metal,.027,[.15,0,0]);
 const phone=group(stand,[0,.49,-.035],[-.16,0,0]);d.box(phone,[0,0,0],[.45,.86,.07],p.darkMetal,.049);
 d.box(phone,[0,0,.037],[.409,.811,.014],p.black,.039);d.roundedPlane(phone,[0,0,.047],.397,.79,.033,p.glass);d.box(phone,[0,.379,.051],[.115,.017,.004],p.black,.006);
 const mug=group(furniture,[4.27,.012,1.11]);
 d.lathe(mug,[0,0,0],[[.001,.009],[.17,.009],[.205,.03],[.216,.41],[.208,.433],[.18,.433],[.173,.409],[.155,.042],[.001,.042]],p.ceramic);
 d.torus(mug,[.233,.224,0],.13,.033,p.ceramic);
 d.cylinder(mug,[0,.342,0],.171,.171,.006,d.physical('#4c3425',{roughness:.2,clearcoat:.6}));
 d.cylinder(mug,[-.055,.242,.209],.027,.027,.008,p.red,[Math.PI/2,0,0],24);
 d.box(furniture,[5.16,.041,.79],[1.0,.067,.71],p.ivory,.027);
 for(const x of [4.68,5.64])d.box(furniture,[x,.114,.79],[.04,.12,.69],p.ivory,.014);
 for(const z of [.46,1.12])d.box(furniture,[5.16,.114,z],[.96,.12,.04],p.ivory,.014);
 flatBook(furniture,[5.12,.08,.79],.65,.43,'#d5c8b5');
 bear(furniture,[5.34,.01,-.045],.75);

 // Upholstery with a rounded frame, stitched piping and curved cantilever chrome tubing.
 const chair=group(furniture,[-.14,-1.45,2.96]);chair.name='Upholstered cantilever chair';
 const cloth=d.mat('#d8cbbb',.88,0,{bumpMap:grain,bumpScale:.012});
 d.box(chair,[0,.57,0],[3.02,1.22,.22],cloth,.102,[-.025,0,0]);
 const stitch=d.frame(chair,[0,.57,.116],2.93,1.13,.003,.008,p.seam,.13);stitch.castShadow=false;
 d.box(chair,[0,-.31,.52],[3.13,.23,1.61],cloth,.095);
 for(const sign of [-1,1]){
  d.tube(chair,[[sign*1.37,.40,.15],[sign*1.38,-.47,.13],[sign*1.39,-.64,.38],[sign*1.39,-.64,1.27],[sign*1.39,-.54,1.4],[sign*1.39,.03,1.4],[sign*1.39,.16,1.25],[sign*1.39,.16,.36]],.033,p.chrome);
  d.box(chair,[sign*1.49,.173,.83],[.26,.155,1.03],cloth,.065);
 }
 d.rod(chair,[-1.39,-.02,.134],[1.39,-.02,.134],.029,p.chrome);

 // Turned overhead lamp. Its light is configured separately in the runtime scene.
 const pendant=group(furniture,[0,5.36,.26]);pendant.name='Spun-metal pendant';
 shade(pendant,[0,0,0],.57,d.mat('#879396',.31,.5));d.cylinder(pendant,[0,.54,0],.069,.071,.071,p.red);
 d.cylinder(pendant,[0,.80,0],.014,.014,.48,p.darkMetal);

 for(const zone of Object.values(zones))d.batch(zone.group);
 d.batch(furniture);
 root.updateMatrixWorld(true);
 return {root,zones,dispose:()=>d.dispose(),geometry:d};
}
