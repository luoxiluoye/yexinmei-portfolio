import * as T from 'three';
import {AtelierGeometry,type V,type Zone,type ZoneId} from './atelier-geometry';
import {applyStudioRefinement} from './refinement';
export const WORK_IMAGES=[
 '/assets/photos/portrait/portrait-01.jpeg','/assets/photos/happy-mahua/still-02.jpeg','/assets/photos/yu-chaoying-concert/concert-03.jpeg',
 '/assets/photos/portrait/portrait-06.jpeg','/assets/photos/ziroom-campaign/campaign-02.jpeg','/assets/photos/meituan-product/product-02.jpeg',
 '/assets/projects/red-leaf/gameplay-scene-hires.png',
 '/assets/photos/portrait/yexinmei-frame-v5.jpg',
];

/** Solids and curved surfaces, with photographs applied only to prints and the display. */
export function createWorkbench(images:T.Texture[]){
 const d=new AtelierGeometry(),root=new T.Group();root.name='Yexinmei / creative workbench';
 const furniture=new T.Group();furniture.name='Continuous desk and furniture';root.add(furniture);
 const grain=d.surface();
 const p={
  ivory:d.physical('#eee6d9',{roughness:.35,clearcoat:.22,bumpMap:grain,bumpScale:.004}),
  edge:d.mat('#f8f3e9',.39,.04),blue:d.physical('#aec6d9',{roughness:.36,clearcoat:.21}),
  blueDark:d.mat('#98a7af',.65),back:d.mat('#bfc5c4',.9,0,{bumpMap:grain,bumpScale:.008}),
  board:d.mat('#e0d8ca',.86,0,{bumpMap:grain,bumpScale:.009}),paper:d.mat('#f4f0e6',.87,0,{bumpMap:grain,bumpScale:.003}),
  pages:d.mat('#e7dfcf',.86),ceramic:d.physical('#eee9df',{roughness:.34,clearcoat:.20,bumpMap:grain,bumpScale:.004}),
  metal:d.mat('#bec2c5',.28,.78),chrome:d.mat('#ccd0d3',.22,.85),darkMetal:d.mat('#4b5155',.38,.65),
  red:d.physical('#ac4d41',{roughness:.35,clearcoat:.28}),black:d.mat('#252729',.66,0,{bumpMap:grain,bumpScale:.006}),
  leather:d.mat('#252724',.8,0,{bumpMap:grain,bumpScale:.012}),
  stem:d.mat('#647143',.85),soil:d.mat('#51483a',.95),seam:d.mat('#c7bbae',.83),
  glass:d.physical('#9fbbca',{transparent:true,opacity:.048,roughness:.20,metalness:0,clearcoat:.5,depthWrite:false}),
 };
 Object.entries(p).forEach(([name,m])=>m.name=name);
 const zones={} as Record<ZoneId,Zone>;
 const group=(parent:T.Object3D,pos:V=[0,0,0],rotation:V=[0,0,0])=>{const g=new T.Group();g.position.set(...pos);g.rotation.set(...rotation);parent.add(g);return g;};
 const plane=(g:T.Object3D,pos:V,w:number,h:number,mat:T.Material)=>d.mesh(g,d.own(new T.PlaneGeometry(w,h)),mat,pos);
 function alcove(id:ZoneId,cx:number,cy:number,w:number,h:number,back:T.Material){
  const g=group(root,[cx,cy,0]);g.name=id;g.userData.zone=id;
  d.box(g,[0,0,-.73],[w,h,.14],back,.09);
  for(const x of [-w/2+.055,w/2-.055])d.box(g,[x,0,-.24],[.11,h,.97],p.ivory,.035);
  for(const y of [-h/2+.055,h/2-.055])d.box(g,[0,y,-.24],[w,.11,.97],p.ivory,.035);
  d.frame(g,[0,0,.237],w,h,.055,.049,p.edge,.13);
  const glow=d.mat('#fff0d7',.45,0,{emissive:'#ffdaac',emissiveIntensity:.42,toneMapped:false});
  const rim=d.frame(g,[0,0,.276],w+.018,h+.018,.012,.012,glow,.145);rim.userData.noBatch=true;rim.castShadow=false;
  d.cylinder(g,[-w/2+.17,h/2-.17,.32],.036,.04,.036,p.red,[Math.PI/2,0,0],24);
  const hit=d.mesh(g,d.own(new T.BoxGeometry(w,h,1.65)),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),[0,0,.25]);
  d.materials.add(hit.material);hit.castShadow=false;hit.receiveShadow=false;hit.userData.noBatch=true;hit.userData.zone=id;
  zones[id]={group:g,glow,anchor:new T.Vector3(cx,cy,.8),hit};return g;
 }
 function shelf(g:T.Object3D,x:number,y:number,w:number,depth=.84){d.box(g,[x,y,-.04],[w,.095,depth],p.ivory,.035);d.box(g,[x,y-.048,.34],[w-.06,.018,.025],p.edge,.007);}
 function spine(title:string,color:string){return d.canvas((c,w,h)=>{
  c.fillStyle=color;c.fillRect(0,0,w,h);c.strokeStyle='rgba(75,64,52,.13)';c.lineWidth=2;c.strokeRect(12,12,w-24,h-24);
  c.fillStyle='#564d43';c.textAlign='center';c.font='29px Georgia';c.save();c.translate(w/2,h/2);c.rotate(-Math.PI/2);c.fillText(title,0,6);c.restore();
  c.fillStyle='rgba(75,64,52,.35)';c.fillRect(w*.3,h*.08,w*.4,2);c.fillRect(w*.3,h*.9,w*.4,2);
 },96,512);}
 function book(parent:T.Object3D,pos:V,w:number,h:number,depth:number,color:string,title:string,lean=0){
  const g=group(parent,pos,[0,0,lean]);g.name='Bound volume';const cover=d.mat(color,.82,0,{bumpMap:grain,bumpScale:.004});
  d.box(g,[0,h/2,0],[w-.032,h-.036,depth-.026],p.pages,.008);
  for(const x of [-w/2+.008,w/2-.008])d.box(g,[x,h/2,0],[.019,h,depth],cover,.007);
  d.box(g,[0,h/2,depth/2-.011],[w,h,.028],cover,.009);
  plane(g,[0,h/2,depth/2+.005],w-.012,h-.035,d.mat('#ffffff',.9,0,{map:spine(title,color)}));
  for(let i=1;i<5;i++)d.box(g,[0,h-.017,depth*(i/5-.5)],[w-.038,.003,.003],p.seam,.001);return g;
 }
 function flatBook(parent:T.Object3D,pos:V,w:number,depth:number,color:string,angle=0){
  const g=group(parent,pos,[0,angle,0]),cover=d.mat(color,.73);d.box(g,[0,.075,0],[w-.036,.112,depth-.03],p.pages,.008);
  for(const y of [.013,.141])d.box(g,[0,y,0],[w,.021,depth],cover,.009);
  d.box(g,[0,.075,-depth/2+.006],[w,.145,.035],cover,.009);
  for(let i=0;i<8;i++)d.box(g,[0,.029+i*.013,depth/2-.012],[w-.06,.002,.002],p.seam,.0008);return g;
 }
 // Plant transforms are populated with detailed, reusable foliage in refinement.ts.
 function plant(parent:T.Object3D,pos:V,s=1,trailing=false){const g=group(parent,pos);g.scale.setScalar(s);g.name=trailing?'Trailing pothos':'Ceramic planter';return g;}
 function bear(parent:T.Object3D,pos:V,s=1){
  const g=group(parent,pos);g.scale.setScalar(s);g.name='Ceramic bear';
  d.ball(g,[0,.29,0],[.195,.235,.153],p.ceramic);d.ball(g,[0,.58,.015],[.181,.164,.146],p.ceramic);
  for(const sign of [-1,1]){d.ball(g,[sign*.136,.718,.008],[.067,.068,.047],p.ceramic);d.ball(g,[sign*.137,.721,.049],[.036,.037,.013],p.paper);d.ball(g,[sign*.203,.34,.018],[.063,.128,.066],p.ceramic);d.ball(g,[sign*.111,.102,.052],[.081,.086,.096],p.ceramic);d.ball(g,[sign*.061,.61,.155],[.013,.017,.009],p.black);}
  d.ball(g,[0,.556,.158],[.075,.052,.024],p.paper);d.ball(g,[0,.568,.184],[.018,.013,.009],p.black);
  d.tube(g,[[0,.558,.181],[0,.542,.182],[-.013,.533,.18]],.003,p.black);d.tube(g,[[0,.542,.182],[.013,.533,.18]],.003,p.black);return g;
 }
 function print(parent:T.Object3D,pos:V,w:number,h:number,texture:T.Texture,angle=0){const g=group(parent,pos,[0,0,angle]);g.name='Archival print';d.box(g,[0,-.024,0],[w+.085,h+.135,.021],p.paper,.008);plane(g,[0,.012,.016],w,h,d.photoMaterial(texture,w/h));return g;}
 function pin(parent:T.Object3D,pos:V,red=false){d.cylinder(parent,pos,.037,.041,.036,red?p.red:p.edge,[Math.PI/2,0,0],24);}
 function pencilCup(parent:T.Object3D,pos:V,s=1,glass=false){
  const g=group(parent,pos);g.scale.setScalar(s);const cupMat=glass?d.physical('#d9d3c7',{transparent:true,opacity:.36,roughness:.18,clearcoat:.3,depthWrite:false}):p.ceramic;
  d.lathe(g,[0,0,0],[[.001,.008],[.14,.008],[.145,.42],[.138,.44],[.12,.44],[.119,.033],[.001,.033]],cupMat);
  for(let i=0;i<6;i++){const x=(i%3-1)*.065,z=(Math.floor(i/3)-.5)*.065,a:V=[x,.06,z],b:V=[x+(i-2.5)*.035,.74+(i%3)*.08,z+.016];d.rod(g,a,b,.013,i===2?p.red:i===4?p.metal:p.black);d.cylinder(g,[b[0],b[1]+.014,b[2]],.002,.013,.06,p.pages,[0,0,-.06],12);}
 }
 function camera(parent:T.Object3D,pos:V){
  const g=group(parent,pos);g.name='Rangefinder camera';d.box(g,[0,.33,0],[1.05,.65,.39],p.leather,.075);d.box(g,[0,.617,0],[1.05,.095,.41],p.metal,.025);d.box(g,[0,.067,0],[1.05,.06,.41],p.metal,.019);d.box(g,[-.455,.32,.013],[.155,.5,.42],p.black,.045);
  d.box(g,[-.32,.566,.222],[.2,.099,.016],p.darkMetal,.009);d.box(g,[-.32,.566,.237],[.142,.057,.008],p.glass,.008);
  d.cylinder(g,[-.32,.696,-.04],.105,.105,.065,p.darkMetal);d.cylinder(g,[.36,.69,0],.073,.073,.078,p.metal);d.cylinder(g,[.16,.693,-.025],.034,.034,.048,p.red);
  const cx=.12,cy=.325;d.cylinder(g,[cx,cy,.266],.324,.327,.15,p.darkMetal,[Math.PI/2,0,0],48);
  for(let i=0;i<7;i++)d.cylinder(g,[cx,cy,.333+i*.025],.295-i*.003,.295-i*.003,.017,i%2?p.black:p.darkMetal,[Math.PI/2,0,0],48);
  d.torus(g,[cx,cy,.51],.258,.017,p.darkMetal);d.cylinder(g,[cx,cy,.505],.235,.235,.039,p.black,[Math.PI/2,0,0],48);d.torus(g,[cx,cy,.53],.206,.011,p.black);
  d.ball(g,[cx,cy,.535],[.185,.185,.028],d.physical('#111d22',{roughness:.16,metalness:.1,clearcoat:.55}));d.torus(g,[cx,cy,.564],.104,.004,p.darkMetal);
  for(let i=0;i<36;i++){const a=i*Math.PI/18;d.box(g,[cx+Math.cos(a)*.313,cy+Math.sin(a)*.313,.296],[.011,.027,.023],p.black,.002,[0,0,a-Math.PI/2]);}
  d.cylinder(g,[.315,.556,.221],.031,.031,.025,p.red,[Math.PI/2,0,0],20);
 }
 function film(parent:T.Object3D,x:number,y:number,z:number,color:string){const mat=d.mat(color,.45,.08);d.cylinder(parent,[x,y+.18,z],.065,.065,.33,mat);d.cylinder(parent,[x,y+.35,z],.072,.072,.028,p.black);d.cylinder(parent,[x,y+.015,z],.07,.07,.025,p.darkMetal);d.box(parent,[x,y+.19,z+.065],[.069,.145,.005],p.paper,.002);}
 function shade(parent:T.Object3D,pos:V,r:number,mat:T.Material){
  const g=group(parent,pos);d.lathe(g,[0,0,0],[[r*.12,r*.85],[r*.19,r*.82],[r*.42,r*.70],[r*.70,r*.47],[r*.9,r*.19],[r,.045],[r,.015],[r*.956,.012],[r*.88,r*.18],[r*.66,r*.44],[r*.38,r*.65],[r*.12,r*.74]],mat);
  d.cylinder(g,[0,.022,0],r*.88,r*.88,.016,d.mat('#fff6dc',.4,0,{emissive:'#ffe7b4',emissiveIntensity:1.4}));d.torus(g,[0,.025,0],r*.96,.013,p.edge,[Math.PI/2,0,0]);return g;
 }
 function deskLamp(){
  const g=group(furniture,[-5.43,0,.80]);g.name='Articulated task light';d.cylinder(g,[0,.045,0],.29,.31,.09,p.ivory);
  const a:V=[0,.14,0],b:V=[-.34,1.13,-.04],c:V=[.26,1.67,-.04];
  for(const z of [-.043,.043]){d.rod(g,[a[0]-.038,a[1],z],[b[0]-.038,b[1],z],.019,p.ivory);d.rod(g,[a[0]+.038,a[1],z],[b[0]+.038,b[1],z],.019,p.ivory);d.rod(g,[b[0],b[1]-.035,z],[c[0],c[1]-.035,z],.019,p.ivory);d.rod(g,[b[0],b[1]+.035,z],[c[0],c[1]+.035,z],.019,p.ivory);}
  for(const q of [a,b,c]){d.cylinder(g,q,.08,.08,.15,p.edge,[Math.PI/2,0,0],24);d.cylinder(g,[q[0],q[1],.092],.027,.027,.013,p.metal,[Math.PI/2,0,0],20);}shade(g,[.45,1.43,.02],.40,p.ivory);
 }
 const wallMesh=plane(furniture,[0,8,-1.12],80,34,d.mat('#edeae4',.96));wallMesh.castShadow=false;
 d.mesh(furniture,d.own(new T.PlaneGeometry(120,120)),d.mat('#e0dfda',.96),[0,-2.22,0],[-Math.PI/2,0,0]).castShadow=false;
 d.box(furniture,[0,-.115,.50],[12.3,.23,2.72],p.ivory,.10);d.box(furniture,[0,-.305,.46],[12.03,.16,2.57],p.blue,.045);
 d.box(furniture,[-5.66,-1.25,-.30],[.16,1.86,.58],p.ivory,.04);d.box(furniture,[-5.66,-2.17,.35],[.5,.06,1.65],p.blue,.023);
 d.box(furniture,[4.28,-1.25,.38],[2.58,1.83,2.23],p.blue,.12);
 for(let i=0;i<2;i++){const y=-.8-i*.83;d.box(furniture,[4.28,y,1.531],[2.4,.758,.062],p.blue,.048);d.frame(furniture,[4.28,y,1.568],2.35,.716,.012,.013,p.edge,.048);d.cylinder(furniture,[4.28,y+.11,1.63],.074,.079,.089,p.red,[Math.PI/2,0,0],32);}
 d.box(furniture,[0,.245,-.49],[11.6,.48,.65],p.ivory,.045);

 const left=alcove('writing',-4.05,2.825,3.16,4.65,p.back);shelf(left,0,.60,2.94);shelf(left,0,-.92,2.94);shelf(left,0,-2.15,2.94);shelf(left,-.77,1.36,1.32,.74);
 plant(left,[-.79,1.42,.00],.68,true);
 let bx=-.11;for(const [i,w] of [.21,.24,.18,.23].entries()){book(left,[bx,.66,.025],w,1.3-i*.07,.55,['#eee9de','#d5c9ba','#e6dfd2','#f3ebdf'][i],['NOTES','PHOTOGRAPHY','ARCHIVE','01'][i],i===2?-.035:0);bx+=w+.027;}bear(left,[1.13,.66,.02],.85);
 let mx=-1.21;for(let i=0;i<6;i++){const w=.16+(i%2)*.05;book(left,[mx,-.86,.035],w,1.10+(i%3)*.065,.54,['#e6ddce','#d8cfbf','#f1ece2'][i%3],['02','IMAGES','NOTES'][i%3],i===5?-.055:0);mx+=w+.032;}
 const picture=group(left,[.52,-.45,.29],[0,-.04,0]);d.box(picture,[0,0,0],[.55,.76,.048],p.edge,.019);print(picture,[0,0,.034],.46,.63,images[7]);flatBook(left,[.62,-.86,.10],.87,.56,'#e2d6c4');
 d.ball(left,[1.1,-.43,.20],[.235,.235,.235],d.mat('#fff1ce',.78,0,{emissive:'#ffdca0',emissiveIntensity:.6,bumpMap:grain,bumpScale:.022}));d.box(left,[1.1,-.735,.18],[.49,.14,.46],p.ceramic,.025);
 d.box(left,[-.86,-1.84,.045],[1.05,.52,.59],p.ivory,.055);d.box(left,[-.86,-1.556,.045],[1.085,.052,.62],p.edge,.025);d.box(left,[-.86,-1.679,.35],[.32,.041,.012],p.black,.012);
 flatBook(left,[.27,-2.10,.07],1.14,.59,'#d5c8b8');flatBook(left,[.27,-1.935,.07],1.03,.57,'#f0e8dc');plant(left,[1.08,-2.10,.09],.68,true);

 const center=alcove('photography',-.23,2.825,4.16,4.65,p.board);
 const holes=new T.InstancedMesh(d.own(new T.CircleGeometry(.0125,10)),d.mat('#928779',.95),18*21);holes.position.z=-.648;const matrix=new T.Matrix4();let hi=0;
 for(let y=0;y<21;y++)for(let x=0;x<18;x++){matrix.makeTranslation(-1.86+x*.218,2.12-y*.214,0);holes.setMatrixAt(hi++,matrix);}holes.instanceMatrix.needsUpdate=true;center.add(holes);holes.userData.noBatch=true;
 const papers:[number,number,number,number,number,number][]=[[-1.19,1.14,.95,.87,-.050,0],[-.05,1.40,1.24,.95,.020,2],[1.20,1.05,1.0,.86,-.045,1],[-1.06,.02,1.02,1.13,.055,3],[.16,.17,1.04,.81,-.045,4],[1.17,-.15,.91,1.12,-.075,5]];
 for(const [x,y,w,h,a,ix] of papers){print(center,[x,y,-.545+ix*.007],w,h,images[ix],a);pin(center,[x+.015,y+h/2+.052,-.487+ix*.007],ix%2===0);}
 shelf(center,0,-2.12,3.94,.90);plant(center,[-1.64,-2.06,.025],.59);camera(center,[-.33,-2.06,.05]);
 for(let i=0;i<4;i++)film(center,.54+i*.18,-2.06,.08,['#ccc9c1','#242628','#c99740','#323434'][i]);pencilCup(center,[1.55,-2.06,.08],.88);

 const upper=alcove('aigc',3.99,3.845,3.35,2.61,p.blue);
 function art(index:number){const map=d.canvas((c,w,h)=>{
  c.fillStyle=['#f0e8dc','#e7e5df','#eaeef0'][index%3];c.fillRect(0,0,w,h);const gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,['#c7846c','#85a6b8','#b78783'][index%3]);gr.addColorStop(1,['#eecba3','#d2e4e8','#e3c7bb'][index%3]);c.fillStyle=gr;c.beginPath();c.arc(w*.59,h*.40,w*.29,0,Math.PI*2);c.fill();
  c.fillStyle=['#7d93a0','#e2c1a8','#7996a6'][index%3];c.beginPath();c.moveTo(w*.11,h*.92);c.bezierCurveTo(w*.2,h*.32,w*.48,h*.54,w*.59,h*.92);c.fill();c.strokeStyle='rgba(81,87,86,.25)';c.lineWidth=2;c.beginPath();c.moveTo(w*.16,h*.82);c.bezierCurveTo(w*.35,h*.41,w*.51,h*.64,w*.82,h*.7);c.stroke();
 },384,512);return d.mat('#ffffff',.8,0,{map});}
 const artm=[art(0),art(1),art(2)];
 for(let i=0;i<4;i++){const g=group(upper,[-.65+i*.34,.06+[.10,.24,-.09,.035][i],-.50+i*.12],[0,-.04,[-.018,-.061,.035,-.025][i]]);d.box(g,[0,0,0],[1.53,1.96,.025],p.paper,.008);plane(g,[0,0,.018],1.44,1.87,artm[i%3]);}
 d.box(upper,[.05,-1.04,-.10],[2.87,.075,.99],p.ivory,.025);for(const x of [-1.37,1.47])d.box(upper,[x,-.69,-.1],[.057,.7,.99],p.ivory,.02);
 const lip=new T.Shape();lip.moveTo(-1.37,-1.0);lip.lineTo(1.47,-1.0);lip.lineTo(1.47,-.50);lip.quadraticCurveTo(1.47,-.38,1.35,-.38);lip.lineTo(.9,-.38);lip.quadraticCurveTo(.82,-.38,.77,-.48);lip.lineTo(.56,-.69);lip.lineTo(-.26,-.69);lip.lineTo(-.45,-.50);lip.quadraticCurveTo(-.52,-.37,-.66,-.37);lip.lineTo(-1.24,-.37);lip.quadraticCurveTo(-1.37,-.37,-1.37,-.5);lip.closePath();
 d.mesh(upper,d.own(new T.ExtrudeGeometry(lip,{depth:.057,bevelEnabled:true,bevelSegments:3,bevelSize:.023,bevelThickness:.018,curveSegments:10})),p.ivory,[0,0,.43]);
 for(let i=0;i<5;i++)book(upper,[.14+i*.126,-.98,.28],.112,1.14+(i%2)*.04,.45,i%2?'#d8cfbf':'#eee6d6','');
 const small=group(upper,[1.0,-.41,.40]);d.box(small,[0,0,0],[.56,.75,.021],p.paper,.007);plane(small,[0,0,.016],.47,.61,artm[1]);

 const lower=alcove('video',3.99,1.424,3.35,1.99,p.blue),tv=group(lower,[0,-.04,-.01]);tv.name='CRT enclosure and optics';
 d.box(tv,[0,0,-.20],[2.69,1.49,.75],p.ivory,.145);d.frame(tv,[-.265,.045,.239],2.07,1.263,.055,.064,p.blueDark,.13);d.box(tv,[-.265,.045,.267],[1.943,1.137,.041],p.black,.12);
 const original=d.photoMaterial(images[6],1.84/1.04),screenMat=new T.MeshBasicMaterial({map:original.map,toneMapped:false});d.materials.add(screenMat);
 d.roundedPlane(tv,[-.265,.045,.301],1.84,1.04,.084,screenMat).castShadow=false;d.roundedPlane(tv,[-.265,.045,.308],1.86,1.06,.087,p.glass).castShadow=false;
 const white=d.mat('#fff8e8',.4,0,{emissive:'#ffffff',emissiveIntensity:.3});d.torus(tv,[-.265,.045,.335],.18,.011,white);
 const tri=new T.Shape();tri.moveTo(-.045,-.08);tri.lineTo(.079,0);tri.lineTo(-.045,.08);tri.closePath();d.mesh(tv,d.own(new T.ShapeGeometry(tri)),white,[-.252,.045,.34]);
 for(let i=0;i<2;i++){const y=.44-i*.285;d.torus(tv,[1.035,y,.219],.103,.014,p.darkMetal);d.cylinder(tv,[1.035,y,.228],.083,.083,.07,p.ivory,[Math.PI/2,0,0]);d.box(tv,[1.035,y+.05,.268],[.012,.036,.008],p.darkMetal,.002);}
 for(let i=0;i<14;i++)d.box(tv,[1.03,-.17-i*.032,.216],[.28,.008,.011],p.blueDark,.003);
 for(const x of [-.85,.86])d.box(tv,[x,-.799,-.13],[.25,.14,.43],p.ivory,.052);plant(lower,[-1.39,-.92,.21],.44);

 deskLamp();flatBook(furniture,[-4.38,.01,.78],1.72,.83,'#d1bfa9',-.025);flatBook(furniture,[-4.33,.179,.80],1.64,.78,'#f0e7d8',.012);pencilCup(furniture,[-3.04,.01,.88],.88,true);
 d.box(furniture,[-.20,.020,.85],[4.81,.034,1.61],d.mat('#9baebb',.96,0,{bumpMap:grain,bumpScale:.004}),.014);
 d.box(furniture,[-.51,.107,.86],[2.91,.105,1.40],p.metal,.045);d.box(furniture,[-.51,.180,.86],[2.89,.042,1.385],d.mat('#c9c5be',.38,.44),.018);d.box(furniture,[-.51,.099,1.569],[.33,.018,.014],p.darkMetal,.006);d.box(furniture,[-.51,.112,.186],[2.4,.06,.065],p.darkMetal,.024);
 const mouse=group(furniture,[1.66,.01,1.05],[0,-.18,0]);d.ball(mouse,[0,.067,0],[.18,.105,.27],p.ceramic);d.tube(mouse,[[0,.17,-.16],[0,.175,-.02]],.002,p.seam);d.box(mouse,[0,.172,-.053],[.038,.014,.063],p.blueDark,.006);
 const stand=group(furniture,[3.22,.015,.89]);d.box(stand,[0,.043,0],[.69,.08,.54],p.ivory,.031);d.box(stand,[0,.205,-.11],[.13,.33,.10],p.metal,.027,[.15,0,0]);
 const phone=group(stand,[0,.49,-.035],[-.16,0,0]);d.box(phone,[0,0,0],[.45,.86,.07],p.darkMetal,.049);d.box(phone,[0,0,.037],[.409,.811,.014],p.black,.039);d.roundedPlane(phone,[0,0,.047],.397,.79,.033,p.glass);d.box(phone,[0,.379,.051],[.115,.017,.004],p.black,.006);
 const mug=group(furniture,[4.27,.012,1.11]);d.lathe(mug,[0,0,0],[[.001,.009],[.17,.009],[.205,.03],[.216,.41],[.208,.433],[.18,.433],[.173,.409],[.155,.042],[.001,.042]],p.ceramic);d.torus(mug,[.233,.224,0],.13,.033,p.ceramic);d.cylinder(mug,[0,.342,0],.171,.171,.006,d.physical('#4c3425',{roughness:.2,clearcoat:.4}));d.cylinder(mug,[-.055,.242,.209],.027,.027,.008,p.red,[Math.PI/2,0,0],24);
 d.box(furniture,[5.16,.041,1.02],[1.0,.067,.71],p.ivory,.027);for(const x of [4.68,5.64])d.box(furniture,[x,.114,1.02],[.04,.12,.69],p.ivory,.014);for(const z of [.69,1.35])d.box(furniture,[5.16,.114,z],[.96,.12,.04],p.ivory,.014);flatBook(furniture,[5.12,.08,1.02],.65,.43,'#d5c8b5');bear(furniture,[5.34,.01,.44],.72);
 const diffuser=group(furniture,[5.91,.015,.82]);d.lathe(diffuser,[0,0,0],[[.001,0],[.115,0],[.125,.02],[.125,.26],[.07,.30],[.06,.36],[.047,.36],[.05,.29],[.105,.24],[.10,.025],[.001,.025]],d.physical('#ccbfac',{roughness:.25,transparent:true,opacity:.48,depthWrite:false}));
 for(let i=0;i<5;i++)d.rod(diffuser,[(i-2)*.015,.13,0],[(i-2)*.05,.88+(i%2)*.09,(i%2-.5)*.08],.006,p.pages);
 const pendant=group(furniture,[0,5.36,.26]);pendant.name='Spun-metal pendant';shade(pendant,[0,0,0],.66,d.mat('#88949a',.30,.46));d.cylinder(pendant,[0,.54,0],.069,.071,.071,p.red);d.cylinder(pendant,[0,.80,0],.014,.014,.48,p.darkMetal);
 applyStudioRefinement(d,root,furniture,zones,p);
 for(const zone of Object.values(zones))d.batch(zone.group);d.batch(furniture);root.updateMatrixWorld(true);
 return {root,zones,dispose:()=>{root.traverse(o=>{if(o instanceof T.SpotLight)o.shadow.dispose();});d.dispose();},geometry:d};
}
