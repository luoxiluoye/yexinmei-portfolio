import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const out=process.env.STUDIO_QA_OUT||'output/aigc-framing-fix';
const base=process.env.STUDIO_QA_URL||'http://localhost:3102';
await fs.mkdir(out,{recursive:true});
// Use the installed browser's real graphics backend. Never lower DPR in QA.
const browser=await chromium.launch({headless:true,channel:'chrome'});
const report={tested:[],errors:[],profiles:{},cycles:[]};let stage='initial';let current;
const q=page=>page.evaluate(()=>window.__STUDIO_QA__);
const stable=(page,mode)=>page.waitForFunction(mode=>{const q=window.__STUDIO_QA__;return q?.studioState?.mode===mode&&q.studioState.phase==='stable';},mode);
async function click(page,key){const p=(await q(page)).points[key];assert(p,`Missing point ${key}`);await page.mouse.click(p.x,p.y);}
const back=page=>page.getByRole('button',{name:'返回上一步'}).click();
const shot=(page,name)=>page.screenshot({path:`${out}/${name}.png`});
async function open(page){page.setDefaultTimeout(60000);page.on('pageerror',e=>report.errors.push(e.message));await page.goto(`${base}/portfolio?qa=1`);await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true');await stable(page,'idle');await page.waitForTimeout(800);}
async function inspectFits(page){const state=await q(page),paper=state.director.papers[state.studioState.activeItemIndex];
 const box=await page.evaluate(()=>({width:innerWidth,height:innerHeight,top:document.querySelector('.studio-aigc-project-note').getBoundingClientRect().bottom,bottom:document.querySelector('.studio-aigc-hud').getBoundingClientRect().top}));
 for(const [x,y] of paper.corners){const px=(x*.5+.5)*box.width,py=(-y*.5+.5)*box.height;assert(px>8&&px<box.width-8,`horizontal crop ${px}`);assert(py>box.top+5&&py<box.bottom-5,`vertical crop/metadata overlap ${py} ${JSON.stringify(box)}`);}
 const [[x1,y1],[x2],[,y2]]=paper.corners;const screenAspect=Math.abs((x2-x1)*box.width/((y2-y1)*box.height));assert(Math.abs(screenAspect-paper.width/paper.height)<.01,`Distorted paper ${screenAspect}`);
 assert.equal(paper.textureWidth,2048,'Inspect must display actual high-resolution texture');
}
async function waitHires(page){await page.waitForFunction(()=>{const q=window.__STUDIO_QA__;return q.director.papers[q.studioState.activeItemIndex].textureWidth===2048;});}
async function stopped(page){await page.waitForTimeout(500);const a=(await q(page)).frames;await page.waitForTimeout(600);assert.equal((await q(page)).frames,a,'Demand rendering did not stop');}
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});const page=await context.newPage();current=page;await open(page);
 const initial=await q(page),canvas=await page.locator('canvas').elementHandle();
 report.graphics=await page.evaluate(()=>{const c=document.querySelector('canvas'),gl=c.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return {renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable',canvasWidth:c.width,cssWidth:c.clientWidth,dpr:c.width/c.clientWidth,gpuMemory:'unavailable'};});
 await stopped(page);await shot(page,'idle');
 stage='two-click project';await click(page,'aigc');await page.waitForTimeout(350);await shot(page,'focus');await stable(page,'collection');await stopped(page);await shot(page,'collection');
 await click(page,'aigc-red-leaf');await stable(page,'project');await page.waitForTimeout(600);await shot(page,'project');assert.equal((await q(page)).director.paperUUIDs.length,5);assert.match(await page.locator('.studio-aigc-project-note').innerText(),/文字冒险/);
 report.tested.push('Two clicks reveal Red Leaf and five persistent physical papers');
 stage='inspect';await click(page,'aigc-red-leaf-paper-1');await stable(page,'inspect');await waitHires(page);await inspectFits(page);await shot(page,'inspect');
 assert.match(await page.getByRole('link',{name:'查看原图'}).getAttribute('href'),/gameplay-scene-hires.png$/);
 const historyLength=await page.evaluate(()=>history.length);
 for(let index=0;index<5;index++){await page.getByRole('button',{name:'下一张作品'}).click();await stable(page,'inspect');await waitHires(page);await inspectFits(page);}
 for(let i=0;i<5;i++)await page.getByRole('button',{name:'下一张作品'}).click();await stable(page,'inspect');await waitHires(page);
 assert.equal(await page.evaluate(()=>history.length),historyLength);assert.equal((await q(page)).studioState.activeItemIndex,1);
 await page.keyboard.press('ArrowRight');await stable(page,'inspect');assert.equal((await q(page)).studioState.activeItemIndex,2);
 await page.mouse.move(720,450);await page.mouse.wheel(150,0);await stable(page,'inspect');assert.equal((await q(page)).studioState.activeItemIndex,3);
 await click(page,'aigc-red-leaf-paper-0');await stable(page,'inspect');assert.equal((await q(page)).studioState.activeItemIndex,0);
 await stopped(page);report.tested.push('Inspect arrows / keyboard / wheel / visible side-paper click; no new history entries; original aspect; high-res 2048; demand stops');
 stage='game link';const popupPromise=page.waitForEvent('popup');await page.getByRole('link',{name:'在线体验'}).click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');assert.match(popup.url(),/^https:\/\/zhihu.hegelsalon.com/);report.game={url:popup.url(),title:await popup.title()};await popup.close();
 stage='return';await page.goBack();await stable(page,'project');assert.equal((await q(page)).studioState.activeItemIndex,1);await page.keyboard.press('Escape');await page.waitForTimeout(400);await shot(page,'returning');await stable(page,'collection');await back(page);await stable(page,'idle');await stopped(page);
 const restored=await q(page);assert.deepEqual(restored.director.folderPosition,[-.62,.03,-.5]);assert.deepEqual(restored.director.paperUUIDs,initial.director.paperUUIDs);assert.equal(restored.director.folderUUID,initial.director.folderUUID);assert(restored.view.camera.every((x,i)=>Math.abs(x-initial.view.camera[i])<.01));assert(await page.locator('canvas').evaluate((node,old)=>node===old,canvas));
 report.profiles.desktop=restored.metricsByStage;report.tested.push('Browser Back inspect → original project index; Esc → collection; Back → idle; same Canvas and UUIDs; restored camera/folder');
 stage='interruptions';for(const progress of [.3,.7]){await click(page,'aigc');await page.waitForFunction(p=>window.__STUDIO_QA__.director.collection>=p,progress);await back(page);await stable(page,'idle');assert.equal((await q(page)).director.collection,0);}
 for(const progress of [.3,.7]){await click(page,'aigc');await stable(page,'collection');await click(page,'aigc-red-leaf');await page.waitForFunction(p=>window.__STUDIO_QA__.director.project>=p,progress);await back(page);await stable(page,'collection');assert.equal((await q(page)).director.project,0);await back(page);await stable(page,'idle');}
 report.tested.push('Actual Back during 30% / 70% entry and folder opening; five rapid inspect-next clicks; no debug transform shortcuts');
 stage='repeat';for(let i=0;i<10;i++){await click(page,'aigc');await stable(page,'collection');await click(page,'aigc-red-leaf');await stable(page,'project');await page.keyboard.press('Escape');await stable(page,'collection');await back(page);await stable(page,'idle');await page.waitForTimeout(200);const state=await q(page);assert.deepEqual(state.director.paperUUIDs,initial.director.paperUUIDs);report.cycles.push({cycle:i+1,textures:state.metrics.textures});}
 assert(report.cycles.every(c=>c.textures===report.cycles[0].textures));report.tested.push('10 real enter/exit cycles; stable texture count and identities');
 stage='resize';await click(page,'aigc');await stable(page,'collection');await click(page,'aigc-red-leaf');await stable(page,'project');await click(page,'aigc-red-leaf-paper-1');await stable(page,'inspect');await waitHires(page);
 for(const viewport of [{width:1440,height:720},{width:1024,height:600}]){await page.setViewportSize(viewport);await page.waitForTimeout(300);await inspectFits(page);await shot(page,`inspect-${viewport.width}x${viewport.height}`);}
 stage='reduced-motion';console.log(stage);await page.emulateMedia({reducedMotion:'reduce'});await back(page);await stable(page,'project');await back(page);await stable(page,'collection');await back(page);await stable(page,'idle');await click(page,'aigc');await stable(page,'collection');await click(page,'aigc-red-leaf');await stable(page,'project');await click(page,'aigc-red-leaf-paper-1');await stable(page,'inspect');await waitHires(page);await inspectFits(page);report.tested.push('Resize 1440×720 / 1024×600 and reduced motion');
 stage='texture recovery';await page.route('**/gameplay-choice-hires.png',route=>route.abort());await page.getByRole('button',{name:'下一张作品'}).click();await stable(page,'inspect');await page.getByRole('button',{name:'图片加载失败 · 重试'}).waitFor();await page.unroute('**/gameplay-choice-hires.png');await page.getByRole('button',{name:'图片加载失败 · 重试'}).click();await waitHires(page);await inspectFits(page);report.tested.push('Failed hires request is visible and retry restores the actual 2048 image');
 await context.close();
 stage='mobile';console.log(stage);const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});const mp=await mobile.newPage();current=mp;await open(mp);assert.equal(await mp.locator('canvas').evaluate(c=>c.width/c.clientWidth),1);await shot(mp,'mobile-idle');await click(mp,'aigc');await stable(mp,'collection');await shot(mp,'mobile-collection');await click(mp,'aigc-red-leaf');await stable(mp,'project');await shot(mp,'mobile-project');await click(mp,'aigc-red-leaf-paper-1');await stable(mp,'inspect');await waitHires(mp);await inspectFits(mp);await shot(mp,'mobile-inspect');
 const cdp=await mobile.newCDPSession(mp);for(const [type,x] of [['touchStart',290],['touchMove',230],['touchMove',150],['touchEnd',90]])await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y:425}],timestamp:Date.now()/1000});
 await stable(mp,'inspect');assert.equal((await q(mp)).studioState.activeItemIndex,2);await waitHires(mp);await inspectFits(mp);await shot(mp,'mobile-choice');await stopped(mp);report.profiles.mobile=(await q(mp)).metricsByStage;report.tested.push('390×844 mobile, DPR 1 actual canvas, inspect swipe without returning, viewport bounds');
 await mobile.close();assert.deepEqual(report.errors,[]);report.success=true;
}catch(error){report.success=false;report.stage=stage;report.failure=String(error);report.failureState=current&&!current.isClosed()?await q(current).catch(()=>null):null;if(current&&!current.isClosed())await shot(current,'failure').catch(()=>{});process.exitCode=1;
}finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();}
