import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='.studio-qa/results';await fs.mkdir(dir,{recursive:true});
const base=process.env.STUDIO_QA_URL||'http://127.0.0.1:3000';
for(let i=0;i<90;i++){try{if((await fetch(base+'/portfolio')).ok)break;}catch{}await new Promise(r=>setTimeout(r,1000));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
const page=await browser.newPage({viewport:{width:1024,height:640},deviceScaleFactor:1,reducedMotion:'reduce'});
page.setDefaultTimeout(90000);
const errors=[],consoleErrors=[],tested=[],report={viewport:{width:1024,height:640},renderer:'Chromium WebGL / SwiftShader'};
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
async function checkpoint(stage){report.stage=stage;report.tested=tested;report.errors=errors;report.consoleErrors=consoleErrors;await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log('CHECKPOINT '+stage);}
async function ready(){await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true'&&window.__STUDIO_QA__?.points?.writing,null,{timeout:90000});await page.waitForTimeout(650);}
async function open(){await page.goto(base+'/portfolio?qa=1',{waitUntil:'networkidle',timeout:90000});await ready();}
async function screenshot(name){return page.screenshot({path:dir+'/'+name+'.jpg',type:'jpeg',quality:92,timeout:90000});}
async function difference(a,b,region){let aa=sharp(a),bb=sharp(b);if(region){aa=aa.extract(region);bb=bb.extract(region);}const av=await aa.removeAlpha().raw().toBuffer(),bv=await bb.removeAlpha().raw().toBuffer();let sum=0,changed=0;for(let i=0;i<av.length;i++){const d=Math.abs(av[i]-bv[i]);sum+=d;if(d>10)changed++;}return {mean:sum/av.length,changed};}
try{
 await open();report.info=await page.evaluate(()=>({title:document.title,model:window.__STUDIO_QA__.stats,bodyWidth:document.body.scrollWidth,width:innerWidth}));
 const shot=await screenshot('desktop'),stats=await sharp(shot).extract({left:120,top:100,width:760,height:440}).stats();report.pixelStatistics=stats.channels.map(c=>({mean:c.mean,stdev:c.stdev,min:c.min,max:c.max}));
 if(stats.channels[0].mean<25||stats.channels[0].stdev<12)throw new Error('Blank or non-rendered scene');await checkpoint('desktop-rendered');

 await page.emulateMedia({reducedMotion:'no-preference'});
 const p=await page.evaluate(()=>window.__STUDIO_QA__.points.photography);
 await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x+180,p.y+28,{steps:7});await page.mouse.up();
 await page.waitForFunction(()=>Math.abs(window.__STUDIO_QA__.view.yaw)>.11,null,{timeout:45000});await page.waitForTimeout(650);
 report.rotation=await page.evaluate(()=>window.__STUDIO_QA__.view);if(page.url().includes('#'))throw new Error('Dragging opened an exhibit');await screenshot('rotated');
 await page.getByRole('button',{name:'恢复工作台正面视角'}).click();await page.waitForFunction(()=>Math.abs(window.__STUDIO_QA__.view.yaw)<.001,null,{timeout:45000});await page.waitForTimeout(500);report.reset=await page.evaluate(()=>window.__STUDIO_QA__.view);

 await page.emulateMedia({reducedMotion:'reduce'});await page.mouse.move(5,80);await page.waitForTimeout(350);const warm=await screenshot('warm-light');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-pendant',{detail:false})));await page.waitForTimeout(500);const off=await screenshot('pendant-off');
 report.lampDifference=await difference(warm,off,{left:385,top:125,width:255,height:405});if(report.lampDifference.mean<.6)throw new Error('Pendant does not visibly light the workspace');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('studio:qa-pendant',{detail:true})));await page.waitForTimeout(500);await checkpoint('studio-interactions-passed');

 for(const zone of ['writing','photography','aigc','video']){
  await open();await page.mouse.move(5,80);await page.waitForTimeout(250);const before=await screenshot('idle-'+zone);
  const point=await page.evaluate(z=>window.__STUDIO_QA__.points[z],zone);await page.mouse.move(point.x,point.y);
  await page.waitForFunction(z=>window.__STUDIO_QA__.highlights[z].amount>.97,zone,{timeout:45000});
  const hovered=await page.evaluate(()=>document.documentElement.dataset.studioHover);if(hovered!==zone)throw new Error('Hover mismatch: '+zone+' / '+hovered);
  const after=await screenshot('hover-'+zone),diff=await difference(before,after);if(diff.changed<600)throw new Error('Invisible hover: '+zone);
  await page.mouse.click(point.x,point.y);
  await page.waitForSelector('.pe-overlay',{state:'visible',timeout:45000});
  await page.waitForFunction(z=>location.hash==='#'+z,zone,{timeout:45000});
  const samePage=await page.evaluate(()=>({pathname:location.pathname,hash:location.hash,overlay:!!document.querySelector('.pe-overlay'),studio:!!document.querySelector('canvas')}));
  if(samePage.pathname!=='/portfolio'||!samePage.overlay||!samePage.studio)throw new Error('Exhibit replaced the studio: '+zone);
  await screenshot('exhibit-'+zone);
  tested.push({zone,hovered,url:page.url(),samePage,visibleDifference:diff});
  await page.getByRole('button',{name:'关闭作品展示'}).click();await page.waitForSelector('.pe-overlay',{state:'detached',timeout:45000});await checkpoint('exhibit-'+zone+'-passed');
 }

 await open();const photoPoint=await page.evaluate(()=>window.__STUDIO_QA__.points.photography);await page.mouse.click(photoPoint.x,photoPoint.y);await page.waitForSelector('.pe-overlay');
 const card=page.locator('.pe-photo-card').filter({visible:true}).first();await card.click();await page.waitForSelector('.pe-lightbox',{state:'visible'});report.photoViewer=true;await page.keyboard.press('Escape');await page.waitForSelector('.pe-lightbox',{state:'detached'});
 await page.getByRole('button',{name:/视觉/}).click();await page.waitForSelector('.pe-folder');await page.locator('.pe-folder').first().click();await page.waitForSelector('.pe-poster-card');report.visualFolder=true;await checkpoint('content-drilldown-passed');

 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,reducedMotion:'reduce'}),mobile=await context.newPage();
 mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto(base+'/portfolio?qa=1',{waitUntil:'networkidle',timeout:90000});await mobile.waitForFunction(()=>window.__STUDIO_QA__?.points?.photography,null,{timeout:90000});
 const tp=await mobile.evaluate(()=>window.__STUDIO_QA__.points.photography);await mobile.touchscreen.tap(tp.x,tp.y);await mobile.waitForSelector('.pe-overlay',{state:'visible',timeout:45000});
 report.mobile=await mobile.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,hash:location.hash,overlay:!!document.querySelector('.pe-overlay'),canvas:!!document.querySelector('canvas')}));
 if(report.mobile.bodyWidth>report.mobile.width+2)throw new Error('Mobile horizontal overflow');
 await mobile.screenshot({path:dir+'/mobile-exhibit.jpg',type:'jpeg',quality:90,timeout:90000});await context.close();

 report.success=true;await checkpoint('all-checks-passed');
}catch(error){report.failure=String(error);await screenshot('failure').catch(()=>{});process.exitCode=1;await checkpoint('failed');}
report.tested=tested;report.errors=errors;report.consoleErrors=consoleErrors;await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));await browser.close();if(errors.length||tested.length!==4)process.exitCode=1;
