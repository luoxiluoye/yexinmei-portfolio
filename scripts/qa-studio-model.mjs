import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const dir='.studio-qa/results';await fs.mkdir(dir,{recursive:true});
const base=process.env.STUDIO_QA_URL||'http://127.0.0.1:3000';
for(let i=0;i<90;i++){try{if((await fetch(base+'/portfolio')).ok)break;}catch{}await new Promise(r=>setTimeout(r,1000));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
const page=await browser.newPage({viewport:{width:1024,height:640},deviceScaleFactor:1,reducedMotion:'reduce'});
page.setDefaultTimeout(90000);
const errors=[],consoleErrors=[],tested=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
async function ready(){
 await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true'&&window.__STUDIO_QA__?.points?.writing,null,{timeout:90000});
}
async function openHash(zone=''){
 await page.goto(base+'/portfolio?qa=1'+(zone?'#'+zone:''),{waitUntil:'networkidle',timeout:90000});
 await ready();
 if(zone)await page.waitForSelector('.pe-overlay',{state:'visible',timeout:45000});
}
try{
 await openHash();
 const info=await page.evaluate(()=>({pathname:location.pathname,canvas:!!document.querySelector('canvas'),model:window.__STUDIO_QA__.stats}));
 if(info.pathname!=='/portfolio'||!info.canvas)throw new Error('Studio did not render');

 const writingPoint=await page.evaluate(()=>window.__STUDIO_QA__.points.writing);
 await page.mouse.click(writingPoint.x,writingPoint.y);
 await page.waitForSelector('.pe-overlay',{state:'visible',timeout:45000});
 const writing=await page.evaluate(()=>({pathname:location.pathname,hash:location.hash,canvas:!!document.querySelector('canvas')}));
 if(writing.pathname!=='/portfolio'||writing.hash!=='#writing'||!writing.canvas)throw new Error('Writing replaced the studio');
 await page.screenshot({path:dir+'/exhibit-writing.jpg',type:'jpeg',quality:88});
 tested.push('writing');

 for(const zone of ['photography','aigc','video']){
   await openHash(zone);
   const state=await page.evaluate(()=>({pathname:location.pathname,hash:location.hash,canvas:!!document.querySelector('canvas'),overlay:!!document.querySelector('.pe-overlay')}));
   if(state.pathname!=='/portfolio'||state.hash!=='#'+zone||!state.canvas||!state.overlay)throw new Error(zone+' is not in-place');
   await page.screenshot({path:dir+'/exhibit-'+zone+'.jpg',type:'jpeg',quality:88});
   tested.push(zone);
 }

 await openHash('photography');
 await page.locator('.pe-photo-card').first().click();
 await page.waitForSelector('.pe-lightbox',{state:'visible'});
 await page.keyboard.press('Escape');
 await page.waitForSelector('.pe-lightbox',{state:'detached'});

 await openHash('aigc');
 await page.locator('.pe-folder').first().click();
 await page.waitForSelector('.pe-poster-card',{state:'visible'});

 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const mobile=await context.newPage();
 await mobile.goto(base+'/portfolio?qa=1#photography',{waitUntil:'networkidle',timeout:90000});
 await mobile.waitForSelector('.pe-overlay',{state:'visible',timeout:90000});
 const mobileState=await mobile.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,pathname:location.pathname,hash:location.hash,canvas:!!document.querySelector('canvas')}));
 if(mobileState.bodyWidth>mobileState.width+2||mobileState.pathname!=='/portfolio'||!mobileState.canvas)throw new Error('Mobile exhibit failed');
 await mobile.screenshot({path:dir+'/mobile-exhibit.jpg',type:'jpeg',quality:88});
 await context.close();

 const report={success:true,tested,errors,consoleErrors,info,mobileState};
 await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));
 console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));
}catch(error){
 const report={success:false,tested,errors,consoleErrors,failure:String(error)};
 await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));
 await page.screenshot({path:dir+'/failure.jpg',type:'jpeg',quality:88}).catch(()=>{});
 console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));
 process.exitCode=1;
}
await browser.close();
if(errors.length||tested.length!==4)process.exitCode=1;
