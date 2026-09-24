import * as T from 'three';
import {SSAOPass} from 'three/examples/jsm/postprocessing/SSAOPass.js';

/** Transparent interaction halos must not become solid depth occluders in the normal pass. */
export class StudioSSAOPass extends SSAOPass {
 override render(...args:Parameters<SSAOPass['render']>):void {
  const hidden:T.Object3D[]=[];
  this.scene.traverse(object=>{
   if(!(object instanceof T.Mesh)||!object.visible||Array.isArray(object.material))return;
   const material=object.material;
   if(material.transparent&&(material instanceof T.ShaderMaterial||material.opacity<.1)){
    hidden.push(object);object.visible=false;
   }
  });
  try{super.render(...args);}finally{hidden.forEach(object=>object.visible=true);}
 }
}
