import {chromium} from 'playwright';
import fs from 'node:fs/promises';

const dir='.studio-qa/results';
await fs.mkdir(dir,{recursive:true});
const base=process.env.STUDIO_QA_URL||'http://127.0.0.1:3000';
for(let i=0;i<90;i++){try{if((await fetch(base+'/portfolio')).ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,1000));}

const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
const page=await browser.newPage({viewport:{width:1024,height:640},deviceScaleFactor:1,reducedMotion:'no-preference'});
page.setDefaultTimeout(90000);
const errors=[],consoleErrors=[],tested=[];
let stage='start';
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});

async function ready(target=page){
 await target.waitForFunction(()=>document.documentElement.dataset.studioReady==='true'&&window.__STUDIO_QA__?.points?.aigc,{timeout:90000});
}
async function openIdle(target=page){
 await target.goto(base+'/portfolio?qa=1',{waitUntil:'networkidle',timeout:90000});
 await ready(target);
 await target.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='idle');
}
async function qa(target=page){return target.evaluate(()=>window.__STUDIO_QA__);}
async function clickPoint(target,key='aigc'){
 const point=await target.evaluate(key=>window.__STUDIO_QA__.points[key],key);
 await target.mouse.click(point.x,point.y);
}
async function waitMode(target,mode){await target.waitForFunction(mode=>{const state=window.__STUDIO_QA__.studioState;return state?.mode===mode&&state.phase==='stable';},mode,{timeout:90000});}
async function backButton(target=page){await target.getByRole('button',{name:'返回上一步'}).click();}
async function assertAigcInCanvas(target,canvas){
 const state=await qa(target);
 const sameCanvas=await canvas.evaluate(node=>node===document.querySelector('canvas'));
 const details=await target.evaluate(()=>({overlay:document.querySelector('.pe-overlay'),filter:getComputedStyle(document.querySelector('.studio-canvas-wrap')).filter,mode:document.documentElement.dataset.studioMode}));
 if(!sameCanvas||details.overlay||details.filter!=='none'||details.mode==='idle')throw new Error('AIGC left the Canvas or reintroduced the overlay/blur');
 return state;
}

try{
 stage='initial idle';await openIdle();
 const initial=await qa();
 const canvas=await page.locator('canvas').elementHandle();
 const initialUUIDs={folder:initial.director.folderUUID,paper:initial.director.paperUUID,meshes:initial.stats.meshes};
 if(!canvas||!initialUUIDs.folder||!initialUUIDs.paper)throw new Error('Missing stable Canvas or AIGC object UUIDs');
 await page.screenshot({path:dir+'/aigc-idle.png',type:'png'});

 stage='focus and collection';await clickPoint(page);
 await page.waitForFunction(()=>window.__STUDIO_QA__.studioState?.mode==='focus');
 await page.screenshot({path:dir+'/aigc-focus.png',type:'png'});
 await waitMode(page,'collection');
 const collection=await assertAigcInCanvas(page,canvas);
 if(collection.director.collection!==1||collection.director.folderUUID!==initialUUIDs.folder)throw new Error('Collection did not settle with the original folder');
 await page.screenshot({path:dir+'/aigc-collection.png',type:'png'});

 stage='item';await clickPoint(page);
 await waitMode(page,'item');
 const item=await assertAigcInCanvas(page,canvas);
 if(item.director.item!==1||item.director.coverRotation>-.9||item.director.paperUUID!==initialUUIDs.paper)throw new Error('Item did not open the original folder/paper');
 await page.screenshot({path:dir+'/aigc-item.png',type:'png'});

 stage='item back';await backButton();
 await waitMode(page,'collection');
 const restoredCollection=await qa();
 if(restoredCollection.director.item!==0||restoredCollection.director.paperUUID!==initialUUIDs.paper)throw new Error('Paper did not reverse into the folder');
 stage='collection back';await backButton();
 await waitMode(page,'idle');
 const restored=await qa();
 if(restored.director.collection!==0||restored.director.folderUUID!==initialUUIDs.folder||restored.stats.meshes!==initialUUIDs.meshes||restored.view.camera.some((value,index)=>Math.abs(value-initial.view.camera[index])>.002))throw new Error(`Folder/camera did not restore exactly: ${JSON.stringify({initial,restored,initialUUIDs})}`);
 tested.push('aigc-full-forward-and-back');

 for(const threshold of [[.25,.4],[.62,.82]]){
  const checkpoint=(threshold[0]+threshold[1])/2;
  stage=`interrupt ${checkpoint}`;
  await page.evaluate(value=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:value})),checkpoint);
  await page.waitForTimeout(80);
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:0})));
  await page.waitForTimeout(450);
 }
 stage='escape';await page.keyboard.press('Escape');
 tested.push('interrupt-30-percent','interrupt-70-percent','escape');

 for(let cycle=0;cycle<10;cycle++){
  stage=`repeat ${cycle+1}`;
  await page.evaluate(value=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:value})),.55);
  await page.waitForTimeout(60);await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:0})));
  await page.waitForTimeout(60);
  const repeated=await qa();
  if(repeated.director.folderUUID!==initialUUIDs.folder||repeated.director.paperUUID!==initialUUIDs.paper||repeated.stats.meshes!==initialUUIDs.meshes)throw new Error(`Object growth or replacement on cycle ${cycle+1}`);
 }
 tested.push('director-reverse-check-x10');

 stage='browser back';
 await page.goto(base+'/portfolio?qa=1#aigc',{waitUntil:'domcontentloaded',timeout:90000});
 await ready(page);await waitMode(page,'collection');await page.goBack();await waitMode(page,'idle');
 tested.push('browser-back');

 stage='reduced motion';await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:.5})));
 await page.waitForTimeout(60);await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-progress',{detail:0})));
 await page.waitForTimeout(180);tested.push('reduced-motion');

 stage='mobile';const mobileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const mobile=await mobileContext.newPage();
 mobile.setDefaultTimeout(90000);
 await openIdle(mobile);await clickPoint(mobile);await waitMode(mobile,'collection');
 await mobile.screenshot({path:dir+'/aigc-mobile-collection.png',type:'png'});
 await clickPoint(mobile);await waitMode(mobile,'item');await mobile.screenshot({path:dir+'/aigc-mobile-item.png',type:'png'});
 const mobileState=await mobile.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,canvas:!!document.querySelector('canvas'),overlay:!!document.querySelector('.pe-overlay'),collection:window.__STUDIO_QA__.director.collection,item:window.__STUDIO_QA__.director.item}));
 if(mobileState.bodyWidth>mobileState.width+2||!mobileState.canvas||mobileState.overlay||mobileState.collection!==1||mobileState.item!==1)throw new Error('Mobile AIGC flow failed');
 await backButton(mobile);await waitMode(mobile,'collection');await backButton(mobile);await waitMode(mobile,'idle');await mobileContext.close();
 tested.push('mobile');

 const report={success:true,tested,errors,consoleErrors,initial,final:await qa(),mobileState,canvasStable:true};
 await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));
}catch(error){
 const report={success:false,tested,errors,consoleErrors,stage,failure:String(error)};
 await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));
 await page.screenshot({path:dir+'/failure.png',type:'png'}).catch(()=>{});
 console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));
 process.exitCode=1;
}
await browser.close();
if(errors.length)process.exitCode=1;
