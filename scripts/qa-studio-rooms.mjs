import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.STUDIO_QA_URL||'http://localhost:3105',out=process.env.STUDIO_QA_OUT||'output/studio-rooms';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),report={errors:[],checks:[],profiles:{},cycles:[]};
const q=page=>page.evaluate(()=>window.__STUDIO_QA__);
const stable=async(page,mode)=>{await page.waitForTimeout(80);await page.waitForFunction(mode=>window.__STUDIO_QA__?.studioState?.mode===mode&&window.__STUDIO_QA__.studioState.phase==='stable',mode);};
const click=async(page,key)=>{const point=(await q(page)).points[key];await page.mouse.click(point.x,point.y);};
const back=page=>page.getByRole('button',{name:'返回上一步'}).click();
const shot=(page,name)=>page.screenshot({path:`${out}/${name}.png`});
const stopped=async page=>{await page.waitForTimeout(400);const frames=(await q(page)).frames;await page.waitForTimeout(500);assert.equal((await q(page)).frames,frames);};
let current,stage='init';
try{for(const mobile of [false,true]){
 const label=mobile?'mobile':'desktop',context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},deviceScaleFactor:mobile?3:2,isMobile:mobile,hasTouch:mobile,recordVideo:{dir:out,size:mobile?{width:390,height:844}:{width:1440,height:900}}}),page=await context.newPage();current=page;page.setDefaultTimeout(30000);page.on('pageerror',error=>report.errors.push(error.message));
 if(process.env.SHARE)await page.goto(process.env.SHARE);
 await page.goto(`${base}/portfolio?qa=1`);await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');await stable(page,'idle');await page.waitForTimeout(1800);await stopped(page);const original=await q(page),canvas=await page.locator('canvas').elementHandle();await shot(page,`${label}-idle`);
 for(const zone of ['photography','writing','video']){
  stage=`${label} ${zone}`;console.log(stage);await click(page,zone);await page.waitForTimeout(250);await shot(page,`${label}-${zone}-entering`);await stable(page,'room');await page.waitForTimeout(350);await shot(page,`${label}-${zone}`);const ids=(await q(page)).room.objects.map(o=>o.uuid);
  if(zone==='photography'){
   const gallery=await q(page);for(const item of gallery.room.objects.filter(o=>o.visible))for(const [x,y] of item.corners){assert(x>-1&&x<1&&y>-1&&y<1,'Photo wall crops a visible print');}
   await click(page,'photography-0');await stable(page,'room');assert.equal((await q(page)).studioState.itemIndex,0);await shot(page,`${label}-photo`);const photo=(await q(page)).room.objects[0];for(const [x,y] of photo.corners)assert(x>-1&&x<1&&y>-1&&y<1,'Inspect photo leaves viewport');
   await page.getByRole('button',{name:'下一张照片'}).click();await stable(page,'room');assert.equal((await q(page)).studioState.itemIndex,1);await shot(page,`${label}-photo-landscape`);
   await back(page);await stable(page,'room');assert.equal((await q(page)).studioState.itemIndex,null);
   if(mobile){await page.getByRole('button',{name:'下一张照片'}).click();await stable(page,'room');assert.equal((await q(page)).studioState.page,1);await shot(page,'mobile-photo-page2');}
  }
  if(zone==='writing'){
   await click(page,'writing-0');await stable(page,'room');assert.equal((await q(page)).studioState.itemIndex,0);await shot(page,`${label}-pei`);assert.match(await page.getByRole('link',{name:'查看知网原文'}).getAttribute('href'),/u5lPRpBnolhv9/);
   for(let i=0;i<3;i++){await page.getByRole('button',{name:'下一篇作品'}).click();await stable(page,'room');}
   assert.equal((await q(page)).studioState.itemIndex,3);await shot(page,`${label}-research`);assert.match(await page.getByRole('link',{name:'查看知网原文'}).getAttribute('href'),/u5lPRpBnoljJp/);
   await page.goBack();await stable(page,'room');assert.equal((await q(page)).studioState.itemIndex,null);
  }
  await stopped(page);assert.deepEqual((await q(page)).room.objects.map(o=>o.uuid),ids);await back(page);await stable(page,'idle');await stopped(page);const restored=await q(page);assert(await page.locator('canvas').evaluate((node,previous)=>node===previous,canvas));for(const item of restored.room.objects){assert.deepEqual(item.position,item.home);assert.deepEqual(item.rotation,item.homeRotation);}assert(restored.view.camera.every((v,i)=>Math.abs(v-original.view.camera[i])<.01));report.checks.push(`${label} ${zone}: physical click, return, same objects/Canvas, exact home, demand stops`);
 }
 report.profiles[label]=(await q(page)).metricsByStage;
 if(!mobile){for(const zone of ['photography','writing','video'])for(const progress of [.3,.7]){await click(page,zone);await page.waitForFunction(p=>window.__STUDIO_QA__.room.progress>=p,progress);await back(page);await stable(page,'idle');assert.equal((await q(page)).room.progress,0);}report.checks.push('30% / 70% interrupted Back in all three zones');
 for(let i=0;i<10;i++){await click(page,'photography');await stable(page,'room');await click(page,'photography-1');await stable(page,'room');await page.keyboard.press('Escape');await stable(page,'room');await back(page);await stable(page,'idle');await stopped(page);report.cycles.push((await q(page)).metrics.textures);}assert(report.cycles.every(v=>v===report.cycles[0]));report.checks.push('10 photography cycles converge textures; Esc');
 await page.emulateMedia({reducedMotion:'reduce'});await click(page,'writing');await stable(page,'room');await click(page,'writing-0');await stable(page,'room');await page.setViewportSize({width:1024,height:600});await page.waitForTimeout(500);await shot(page,'writing-resize');await back(page);await stable(page,'room');await back(page);await stable(page,'idle');report.checks.push('Reduced motion + resize');}
 await context.close();await page.video().saveAs(`${out}/${label}-normal-speed.webm`);
}assert.deepEqual(report.errors,[]);report.success=true;
}catch(error){report.success=false;report.stage=stage;report.error=String(error);if(current&&!current.isClosed()){report.state=await q(current);await shot(current,'failure');}process.exitCode=1;
}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();}
