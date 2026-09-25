'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import '../../styles/portfolio-exhibit-overlay.css';

export type ExhibitZone='writing'|'photography'|'aigc'|'video';

type Props={
  zone:ExhibitZone;
  onZoneChange:(zone:ExhibitZone)=>void;
  onClose:()=>void;
};

type PhotoItem={src:string;title:string;series:string};
type VisualItem={src:string;title:string};
type VisualCollection={id:string;title:string;subtitle:string;color:string;items:VisualItem[]};

const TABS:{id:ExhibitZone;label:string;num:string}[]=[
  {id:'photography',label:'摄影',num:'01'},
  {id:'aigc',label:'视觉 / AIGC',num:'02'},
  {id:'writing',label:'文字',num:'03'},
  {id:'video',label:'视频',num:'04'},
];

const PHOTOS:PhotoItem[]=[
  {src:'/assets/photos/portrait/portrait-01.jpeg',title:'人像摄影 · 01',series:'人像'},
  {src:'/assets/photos/portrait/portrait-05.jpeg',title:'人像摄影 · 02',series:'人像'},
  {src:'/assets/photos/portrait/portrait-08.jpeg',title:'人像摄影 · 03',series:'人像'},
  {src:'/assets/photos/portrait/portrait-11.jpeg',title:'人像摄影 · 04',series:'人像'},
  {src:'/assets/photos/happy-mahua/still-01.jpeg',title:'《捞金晚宴》剧照 · 01',series:'剧照'},
  {src:'/assets/photos/happy-mahua/still-02.jpeg',title:'《捞金晚宴》剧照 · 02',series:'剧照'},
  {src:'/assets/photos/happy-mahua/still-03.jpeg',title:'《捞金晚宴》剧照 · 03',series:'剧照'},
  {src:'/assets/photos/yu-chaoying-concert/concert-01.jpeg',title:'余超颖演唱会 · 01',series:'舞台'},
  {src:'/assets/photos/yu-chaoying-concert/concert-03.jpeg',title:'余超颖演唱会 · 02',series:'舞台'},
  {src:'/assets/photos/yu-chaoying-concert/concert-05.jpeg',title:'余超颖演唱会 · 03',series:'舞台'},
  {src:'/assets/photos/meituan-product/product-01.jpeg',title:'商家产品摄影 · 01',series:'产品'},
  {src:'/assets/photos/meituan-product/product-03.jpeg',title:'商家产品摄影 · 02',series:'产品'},
  {src:'/assets/photos/meituan-product/product-04.jpeg',title:'商家产品摄影 · 03',series:'产品'},
  {src:'/assets/photos/ziroom-campaign/campaign-01.jpeg',title:'自如毕业宣传 · 01',series:'宣传'},
  {src:'/assets/photos/ziroom-campaign/campaign-03.jpeg',title:'自如毕业宣传 · 02',series:'宣传'},
  {src:'/assets/photos/ziroom-campaign/campaign-05.jpeg',title:'自如毕业宣传 · 03',series:'宣传'},
];

const VISUALS:VisualCollection[]=[
  {
    id:'red-leaf',
    title:'赤页',
    subtitle:'AI 互动叙事 · 产品视觉',
    color:'#a95c50',
    items:[
      {src:'/assets/projects/red-leaf/landing-hero-hires.png',title:'Landing Hero'},
      {src:'/assets/projects/red-leaf/gameplay-scene-hires.png',title:'Gameplay Scene'},
      {src:'/assets/projects/red-leaf/gameplay-choice-hires.png',title:'Choice Interface'},
      {src:'/assets/projects/red-leaf/library-hires.png',title:'Story Library'},
      {src:'/assets/projects/red-leaf/story-modal-hires.png',title:'Story Modal'},
    ],
  },
  {
    id:'social',
    title:'个人内容视觉',
    subtitle:'真实主页与内容界面',
    color:'#879dac',
    items:[
      {src:'/assets/projects/personal-social/xiaohongshu/profile-hires.png',title:'小红书主页'},
      {src:'/assets/projects/personal-social/zhihu/profile-hires.png',title:'知乎主页'},
    ],
  },
];

const WRITINGS=[
  {
    id:'pei',
    kind:'电影剧本',
    title:'陪',
    subtitle:'《电影文学》刊发',
    color:'#9d6552',
    note:'电影剧本作品。当前页面保留作品信息与原文入口，完整刊发页将在高清原稿接入后直接替换到阅读区。',
    link:'https://kns.cnki.net/',
    linkText:'查看知网原文',
  },
  {
    id:'regrets',
    kind:'校园图文',
    title:'「后悔药」集锦',
    subtitle:'如果重回大一，你绝对不会做什么？',
    color:'#718371',
    note:'以校园真实回答为内容主体的图文作品。阅读区保留原发布入口，避免重复堆叠项目职责。',
    link:'https://mp.weixin.qq.com/s/BHc32suL-MCH5DTRKuSvqQ',
    linkText:'阅读微信原文',
  },
  {
    id:'zhou',
    kind:'非遗报道',
    title:'当铁花遇上直播间',
    subtitle:'周家刀如何「锻」出非遗新生',
    color:'#616d78',
    note:'围绕非遗锻刀、短视频和直播传播展开的报道。原文中包含采访视频与锻造过程互动内容。',
    link:'https://mp.weixin.qq.com/s/kVI3RlZmvkxI9FCXlhtOtw',
    linkText:'阅读微信原文',
  },
];

function CloseIcon(){return <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M6 6l12 12M18 6L6 18'/></svg>;}
function ArrowIcon({dir}:{dir:'left'|'right'}){return <svg viewBox='0 0 24 24' aria-hidden='true' style={{transform:dir==='right'?'rotate(180deg)':undefined}}><path d='M15 5l-7 7 7 7'/></svg>;}
function BackIcon(){return <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M15 5l-7 7 7 7'/></svg>;}
function ExternalIcon(){return <svg viewBox='0 0 24 24' aria-hidden='true'><path d='M14 5h5v5M19 5l-9 9'/><path d='M18 13v5H6V6h5'/></svg>;}

export function PortfolioExhibitOverlay({zone,onZoneChange,onClose}:Props){
  const [photoFilter,setPhotoFilter]=useState('全部');
  const [photoIndex,setPhotoIndex]=useState(0);
  const [photoViewer,setPhotoViewer]=useState<number|null>(null);
  const [collection,setCollection]=useState<string|null>(null);
  const [visualIndex,setVisualIndex]=useState(0);
  const [visualViewer,setVisualViewer]=useState<number|null>(null);
  const [reading,setReading]=useState<string|null>(null);
  const drag=useRef<{x:number;pointerId:number}|null>(null);

  const filteredPhotos=useMemo(
    ()=>photoFilter==='全部'?PHOTOS:PHOTOS.filter(item=>item.series===photoFilter),
    [photoFilter]
  );
  const activeCollection=VISUALS.find(item=>item.id===collection)??null;
  const activeWriting=WRITINGS.find(item=>item.id===reading)??null;

  useEffect(()=>{
    setPhotoViewer(null);setVisualViewer(null);setCollection(null);setReading(null);
  },[zone]);

  useEffect(()=>{
    function onKey(event:KeyboardEvent){
      if(event.key==='Escape'){
        if(photoViewer!==null){setPhotoViewer(null);return;}
        if(visualViewer!==null){setVisualViewer(null);return;}
        if(collection){setCollection(null);return;}
        if(reading){setReading(null);return;}
        onClose();
      }
      if(event.key==='ArrowLeft'){
        if(photoViewer!==null)setPhotoViewer((photoViewer-1+filteredPhotos.length)%filteredPhotos.length);
        else if(zone==='photography')setPhotoIndex(v=>Math.max(0,v-1));
        else if(collection&&activeCollection)setVisualIndex(v=>Math.max(0,v-1));
      }
      if(event.key==='ArrowRight'){
        if(photoViewer!==null)setPhotoViewer((photoViewer+1)%filteredPhotos.length);
        else if(zone==='photography')setPhotoIndex(v=>Math.min(filteredPhotos.length-1,v+1));
        else if(collection&&activeCollection)setVisualIndex(v=>Math.min(activeCollection.items.length-1,v+1));
      }
    }
    window.addEventListener('keydown',onKey);
    return()=>window.removeEventListener('keydown',onKey);
  },[photoViewer,visualViewer,collection,reading,zone,filteredPhotos.length,activeCollection,onClose]);

  function changeFilter(value:string){
    setPhotoFilter(value);setPhotoIndex(0);setPhotoViewer(null);
  }

  function stageDown(event:React.PointerEvent){
    drag.current={x:event.clientX,pointerId:event.pointerId};
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function stageUp(event:React.PointerEvent){
    const start=drag.current;if(!start)return;
    const dx=event.clientX-start.x;drag.current=null;
    if(Math.abs(dx)>42){
      setPhotoIndex(v=>Math.max(0,Math.min(filteredPhotos.length-1,v+(dx<0?1:-1))));
    }
  }

  return <section className={'pe-overlay pe-from-'+zone} role='dialog' aria-modal='true' aria-label='作品展示'>
    <header className='pe-header'>
      <button className='pe-back' type='button' onClick={onClose}><BackIcon/><span>返回工作台</span></button>
      <div className='pe-wordmark'>LUO YEXINMEI <small>●</small></div>
      <button className='pe-close' type='button' onClick={onClose} aria-label='关闭作品展示'><CloseIcon/></button>
    </header>

    <nav className='pe-tabs' aria-label='作品分类'>
      {TABS.map(tab=><button key={tab.id} type='button' aria-current={zone===tab.id?'page':undefined} onClick={()=>onZoneChange(tab.id)}>
        <span>{tab.label}</span><small>{tab.num}</small>
      </button>)}
    </nav>

    <div className='pe-content'>
      {zone==='photography'&&<div className='pe-page pe-photo-page'>
        <div className='pe-intro'>
          <div><span className='pe-eyebrow'>PHOTOGRAPHY / 01</span><h2>摄影作品</h2></div>
          <div className='pe-count'><strong>{String(filteredPhotos.length).padStart(2,'0')}</strong><span>张作品</span></div>
        </div>
        <div className='pe-photo-stage' onPointerDown={stageDown} onPointerUp={stageUp}>
          {filteredPhotos.map((item,index)=>{
            const offset=index-photoIndex;
            const visible=Math.abs(offset)<=4;
            const scale=1-Math.min(Math.abs(offset),4)*.08;
            const transform='translate(-50%,-50%) translateX('+(offset*205)+'px) translateZ('+(-Math.abs(offset)*110)+'px) rotateY('+(-offset*13)+'deg) rotateZ('+(offset*1.3)+'deg) scale('+scale+')';
            return <button key={item.src} type='button' className='pe-photo-card' aria-label={'查看 '+item.title} style={{transform,zIndex:20-Math.abs(offset),opacity:visible?1:0,pointerEvents:visible?'auto':'none'}} onClick={()=>{setPhotoIndex(index);setPhotoViewer(index);}}>
              <img src={item.src} alt={item.title}/>
              <span>{item.title}</span>
            </button>;
          })}
        </div>
        <div className='pe-carousel-controls'>
          <button type='button' onClick={()=>setPhotoIndex(v=>Math.max(0,v-1))} disabled={photoIndex===0}><ArrowIcon dir='left'/></button>
          <span>{String(photoIndex+1).padStart(2,'0')} / {String(filteredPhotos.length).padStart(2,'0')}</span>
          <button type='button' onClick={()=>setPhotoIndex(v=>Math.min(filteredPhotos.length-1,v+1))} disabled={photoIndex===filteredPhotos.length-1}><ArrowIcon dir='right'/></button>
        </div>
        <div className='pe-filters'>
          {['全部','人像','剧照','舞台','产品','宣传'].map(value=><button key={value} type='button' aria-pressed={photoFilter===value} onClick={()=>changeFilter(value)}>{value}</button>)}
        </div>
        <p className='pe-hint'>拖动照片墙浏览 · 点击照片查看完整画面</p>
      </div>}

      {zone==='aigc'&&<div className='pe-page pe-visual-page'>
        {!activeCollection&&<>
          <div className='pe-intro'>
            <div><span className='pe-eyebrow'>VISUAL / AIGC / 02</span><h2>视觉作品</h2></div>
            <div className='pe-count'><strong>{String(VISUALS.length).padStart(2,'0')}</strong><span>组作品</span></div>
          </div>
          <div className='pe-folder-stage'>
            {VISUALS.map((item,index)=><button key={item.id} type='button' className='pe-folder' style={{'--folder':item.color} as React.CSSProperties} onClick={()=>{setCollection(item.id);setVisualIndex(0);}}>
              <span className='pe-folder-back'/>
              {item.items.slice(0,3).map((image,i)=><span className='pe-folder-sheet' key={image.src} style={{'--sheet-z':String(i*9)+'px','--sheet-y':String(-i*4)+'px','--sheet-a':String((i-1)*1.6)+'deg'} as React.CSSProperties}><img src={image.src} alt=''/></span>)}
              <span className='pe-folder-front'><b>{item.title}</b><small>{item.subtitle}</small><em>{String(index+1).padStart(2,'0')}</em></span>
            </button>)}
          </div>
          <p className='pe-hint'>点击文件夹展开作品 · 当前仅展示已接入仓库的真实视觉素材</p>
        </>}
        {activeCollection&&<>
          <button className='pe-collection-back' type='button' onClick={()=>setCollection(null)}><BackIcon/><span>返回文件夹</span></button>
          <div className='pe-intro pe-intro-compact'>
            <div><span className='pe-eyebrow'>VISUAL COLLECTION</span><h2>{activeCollection.title}</h2><p>{activeCollection.subtitle}</p></div>
            <div className='pe-count'><strong>{String(activeCollection.items.length).padStart(2,'0')}</strong><span>张画面</span></div>
          </div>
          <div className='pe-poster-stage'>
            {activeCollection.items.map((item,index)=>{
              const offset=index-visualIndex;
              const transform='translate(-50%,-50%) translateX('+(offset*245)+'px) translateZ('+(-Math.abs(offset)*125)+'px) rotateY('+(-offset*12)+'deg) scale('+(1-Math.min(Math.abs(offset),3)*.09)+')';
              return <button type='button' key={item.src} className='pe-poster-card' style={{transform,zIndex:20-Math.abs(offset),opacity:Math.abs(offset)<=3?1:0,pointerEvents:Math.abs(offset)<=3?'auto':'none'}} onClick={()=>{setVisualIndex(index);setVisualViewer(index);}}>
                <img src={item.src} alt={item.title}/><span>{item.title}</span>
              </button>;
            })}
          </div>
          <div className='pe-carousel-controls'>
            <button type='button' onClick={()=>setVisualIndex(v=>Math.max(0,v-1))} disabled={visualIndex===0}><ArrowIcon dir='left'/></button>
            <span>{String(visualIndex+1).padStart(2,'0')} / {String(activeCollection.items.length).padStart(2,'0')}</span>
            <button type='button' onClick={()=>setVisualIndex(v=>Math.min(activeCollection.items.length-1,v+1))} disabled={visualIndex===activeCollection.items.length-1}><ArrowIcon dir='right'/></button>
          </div>
        </>}
      </div>}

      {zone==='writing'&&<div className='pe-page pe-writing-page'>
        {!activeWriting&&<>
          <div className='pe-intro'>
            <div><span className='pe-eyebrow'>WRITING / 03</span><h2>文字作品</h2></div>
            <div className='pe-count'><strong>{String(WRITINGS.length).padStart(2,'0')}</strong><span>件作品</span></div>
          </div>
          <div className='pe-book-stage'>
            {WRITINGS.map((item,index)=><button type='button' key={item.id} className='pe-book' style={{'--book':item.color} as React.CSSProperties} onClick={()=>setReading(item.id)}>
              <span className='pe-book-pages'/>
              <span className='pe-book-cover'>
                <small>{item.kind} / {String(index+1).padStart(2,'0')}</small>
                <b>{item.title}</b>
                <em>{item.subtitle}</em>
                <i>罗叶馨梅</i>
              </span>
              <span className='pe-book-caption'>点击翻开</span>
            </button>)}
          </div>
          <p className='pe-hint'>点击书册展开 · 阅读作品信息或进入原文</p>
        </>}
        {activeWriting&&<article className='pe-reader'>
          <button className='pe-collection-back' type='button' onClick={()=>setReading(null)}><BackIcon/><span>返回书架</span></button>
          <div className='pe-reader-book' style={{'--book':activeWriting.color} as React.CSSProperties}>
            <small>{activeWriting.kind}</small><h2>{activeWriting.title}</h2><p>{activeWriting.subtitle}</p><span>罗叶馨梅</span>
          </div>
          <div className='pe-reader-sheet'>
            <span className='pe-eyebrow'>SELECTED WRITING</span>
            <h3>{activeWriting.title}</h3>
            <h4>{activeWriting.subtitle}</h4>
            <p>{activeWriting.note}</p>
            <a href={activeWriting.link} target='_blank' rel='noreferrer'>{activeWriting.linkText}<ExternalIcon/></a>
            <div className='pe-reader-rule'/>
            <small>完整正文或刊发原图只在有可核验原稿时接入，避免用示意内容替代作品。</small>
          </div>
        </article>}
      </div>}

      {zone==='video'&&<div className='pe-page pe-video-page'>
        <div className='pe-intro pe-video-intro'>
          <div><span className='pe-eyebrow'>VIDEO / 04</span><h2>视频作品</h2></div>
          <div className='pe-count'><strong>01</strong><span>件作品</span></div>
        </div>
        <div className='pe-cinema'>
          <div className='pe-screen'>
            <div className='pe-forge-visual'>
              <span className='pe-spark s1'/><span className='pe-spark s2'/><span className='pe-spark s3'/><span className='pe-spark s4'/>
              <div><small>DOCUMENTARY</small><strong>周家刀</strong><p>非遗手艺传承纪录片</p></div>
            </div>
            <a className='pe-play' href='https://mp.weixin.qq.com/s/kVI3RlZmvkxI9FCXlhtOtw' target='_blank' rel='noreferrer' aria-label='查看周家刀相关报道与采访视频'>
              <svg viewBox='0 0 48 48' aria-hidden='true'><circle cx='24' cy='24' r='22'/><path d='M20 16l13 8-13 8z'/></svg>
            </a>
          </div>
          <aside className='pe-film-info'>
            <span>01</span><h3>周家刀</h3><p>非遗手艺传承纪录片</p>
            <small>完整成片尚未接入当前仓库。这里保留真实作品入口，不使用其他项目画面冒充视频。</small>
            <a href='https://mp.weixin.qq.com/s/kVI3RlZmvkxI9FCXlhtOtw' target='_blank' rel='noreferrer'>查看相关报道与采访视频 <ExternalIcon/></a>
          </aside>
        </div>
      </div>}
    </div>

    {photoViewer!==null&&filteredPhotos[photoViewer]&&<div className='pe-lightbox' role='dialog' aria-modal='true' aria-label='摄影作品大图'>
      <button className='pe-lightbox-close' type='button' onClick={()=>setPhotoViewer(null)} aria-label='关闭大图'><CloseIcon/></button>
      <button className='pe-lightbox-nav pe-prev' type='button' onClick={()=>setPhotoViewer((photoViewer-1+filteredPhotos.length)%filteredPhotos.length)}><ArrowIcon dir='left'/></button>
      <figure><img src={filteredPhotos[photoViewer].src} alt={filteredPhotos[photoViewer].title}/><figcaption>{filteredPhotos[photoViewer].title}</figcaption></figure>
      <button className='pe-lightbox-nav pe-next' type='button' onClick={()=>setPhotoViewer((photoViewer+1)%filteredPhotos.length)}><ArrowIcon dir='right'/></button>
    </div>}

    {visualViewer!==null&&activeCollection&&activeCollection.items[visualViewer]&&<div className='pe-lightbox' role='dialog' aria-modal='true' aria-label='视觉作品大图'>
      <button className='pe-lightbox-close' type='button' onClick={()=>setVisualViewer(null)} aria-label='关闭大图'><CloseIcon/></button>
      <button className='pe-lightbox-nav pe-prev' type='button' onClick={()=>setVisualViewer((visualViewer-1+activeCollection.items.length)%activeCollection.items.length)}><ArrowIcon dir='left'/></button>
      <figure><img src={activeCollection.items[visualViewer].src} alt={activeCollection.items[visualViewer].title}/><figcaption>{activeCollection.items[visualViewer].title}</figcaption></figure>
      <button className='pe-lightbox-nav pe-next' type='button' onClick={()=>setVisualViewer((visualViewer+1)%activeCollection.items.length)}><ArrowIcon dir='right'/></button>
    </div>}
  </section>;
}
