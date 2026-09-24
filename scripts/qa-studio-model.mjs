import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='.studio-qa/results';await fs.mkdir(dir,{recursive:true});
for(let i=0;i<90;i++){try{if((await fetch('http://127.0.0.1:3000/portfolio')).ok)break;}catch{}await new Promise(r=>setTimeout(r,1000));}
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle']});
const page=await browser.newPage({viewport:{width:1536,height:864},deviceScaleFactor:1});
const errors=[],consoleErrors=[],tested=[],report={};page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
async function ready(){await page.waitForFunction(()=>document.documentElement.dataset.studioReady==='true'&&window.__STUDIO_QA__?.points?.writing,{timeout:120000});await page.waitForTimeout(2000);}
async function open(){await page.goto('http://127.0.0.1:3000/portfolio?qa=1',{waitUntil:'networkidle',timeout:120000});await ready();}
async function screenshot(name){return await page.screenshot({path:dir+'/'+name+'.jpg',type:'jpeg',quality:94,timeout:120000});}
try{
 await open();report.info=await page.evaluate(()=>({canvas:!!document.querySelector('canvas'),title:document.title,model:window.__STUDIO_QA__?.stats,frames:window.__STUDIO_QA__?.frames,bodyWidth:document.body.scrollWidth,width:innerWidth}));
 const shot=await screenshot('desktop'),stats=await sharp(shot).extract({left:200,top:150,width:1100,height:640}).stats();report.pixelStatistics=stats.channels.map(c=>({mean:c.mean,stdev:c.stdev,min:c.min,max:c.max}));
 if(stats.channels[0].mean<25||stats.channels[0].stdev<12)throw new Error('Blank or non-rendered scene');
 await sharp(shot).extract({left:480,top:635,width:610,height:229}).toFile(dir+'/chair-back.jpg');
 const chair=report.info.model?.chair;if(!chair||chair.forward[2]!==-1||chair.armFrontZ>=chair.backZ)throw new Error('Chair must face the desk and expose its rear');
 for(const zone of ['writing','photography','aigc','video']){
  if(tested.length)await open();const point=await page.evaluate(z=>window.__STUDIO_QA__.points[z],zone);
  await page.mouse.move(point.x,point.y);await page.waitForTimeout(1000);const hovered=await page.evaluate(()=>document.documentElement.dataset.studioHover);
  if(hovered!==zone)throw new Error('Hover mismatch: '+zone+' / '+hovered);
  if(zone==='photography')await screenshot('hover');
  await page.mouse.click(point.x,point.y);await page.waitForURL('**/portfolio/'+zone,{timeout:45000});tested.push({zone,hovered,route:page.url()});
 }
 await page.setViewportSize({width:390,height:844});await open();await screenshot('mobile');report.mobile=await page.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,canvas:document.querySelector('canvas')?.getBoundingClientRect().toJSON()}));
}catch(error){report.failure=String(error);await screenshot('failure').catch(()=>{});process.exitCode=1;}
report.tested=tested;report.errors=errors;report.consoleErrors=consoleErrors;await fs.writeFile(dir+'/report.json',JSON.stringify(report,null,2));console.log('STUDIO_QA_REPORT:'+JSON.stringify(report));await browser.close();if(errors.length||tested.length!==4)process.exitCode=1;
