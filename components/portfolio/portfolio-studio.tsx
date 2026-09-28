'use client';

import {Canvas} from '@react-three/fiber';
import {Component,Suspense,useEffect,useRef,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {StudioScene,type PortfolioZoneId} from './studio-scene';
import {StudioVideoControls} from './studio-video-controls';
import {STUDIO_PHOTOS,STUDIO_WRITINGS,STUDIO_VIDEO} from './studio-content';
import {IDLE_STATE,stateFromHash,studioDepth,hashForStudioState,type StudioState} from './studio-state';
import {AIGC_COLLECTIONS,collectionContent} from './aigc-content';
import type {DirectorMilestone} from './studio-director';
import '../../styles/portfolio-interactions.css';

function portfolioUrl(hash=''){if(typeof window==='undefined')return '/portfolio'+hash;return window.location.pathname+window.location.search+hash;}

class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onError();}
  render(){
    return this.state.failed
      ?<div className='studio-fallback'><p>三维场景未能加载。</p><button onClick={()=>window.location.reload()}>重新加载</button></div>
      :this.props.children;
  }
}

export function PortfolioStudio(){
  const [studioState,setStudioState]=useState<StudioState>(IDLE_STATE);
  const queuedHistoryState=useRef<StudioState|null>(null);
  const stateRef=useRef(studioState);stateRef.current=studioState;
  const [roomTextureError,setRoomTextureError]=useState(false);
  useEffect(()=>{const fail=()=>setRoomTextureError(true);window.addEventListener('studio:room-texture-error',fail);return()=>window.removeEventListener('studio:room-texture-error',fail);},[]);
  const [ready,setReady]=useState(false);
  const [textureStatus,setTextureStatus]=useState<Record<string,string>>({});
  useEffect(()=>{const update=(event:Event)=>{const {id,status}=(event as CustomEvent<{id:string;status:string}>).detail;setTextureStatus(previous=>({...previous,[id]:status}));};window.addEventListener('studio:texture-status',update);return()=>window.removeEventListener('studio:texture-status',update);},[]);

  useEffect(()=>{
    function syncFromHistory(){
      const next=stateFromHash(window.location.hash);if(next.mode!=='idle'){const canonical=hashForStudioState(next);if(window.location.hash!==canonical)window.history.replaceState(window.history.state,'',portfolioUrl(canonical));}if(next.mode==='room')next.page=window.history.state?.page??0;
      const previous=stateRef.current;
      if(queuedHistoryState.current&&previous.mode==='idle'&&previous.phase==='leaving'){queuedHistoryState.current=next.mode==='idle'?null:next;return;}
      if(previous.mode==='idle'&&next.mode==='idle')return;
      if(previous.mode!=='idle'&&next.mode!=='idle'&&previous.zone!==next.zone){queuedHistoryState.current=next;const leaving:StudioState={mode:'idle',phase:'leaving'};stateRef.current=leaving;setStudioState(leaving);return;}
      queuedHistoryState.current=null;const updated={...next,phase:studioDepth(next)<studioDepth(previous)?'leaving':'entering'} as StudioState;stateRef.current=updated;setStudioState(updated);
    }
    const initial=stateFromHash(window.location.hash);if(initial.mode!=='idle'){setStudioState(initial);window.history.replaceState(window.history.state,'',portfolioUrl(hashForStudioState(initial)));}
    const route=window.location.pathname+window.location.search;
    const onHistory=(event:PopStateEvent)=>{if(window.location.pathname+window.location.search===route){event.stopImmediatePropagation();syncFromHistory();}};
    window.addEventListener('popstate',onHistory,true);window.addEventListener('hashchange',syncFromHistory);
    return()=>{window.removeEventListener('popstate',onHistory,true);window.removeEventListener('hashchange',syncFromHistory);};
  },[]);
  function openZone(id:PortfolioZoneId){
    if(studioState.mode!=='idle'||studioState.phase==='leaving')return;
    const next:StudioState=id==='aigc'?{mode:'focus',zone:'aigc',phase:'entering'}:{mode:'room',zone:id,itemIndex:null,page:0,phase:'entering'};
    stateRef.current=next;setStudioState(next);window.history.pushState(id==='aigc'?{portfolioAigc:'collection'}:{portfolioRoom:'collection'},'',portfolioUrl('#'+id));
  }
  function selectRoomItem(index:number){
    const previous=stateRef.current;if(previous.mode!=='room'||previous.zone==='video')return;
    const next:StudioState={...previous,itemIndex:index,phase:'entering'};stateRef.current=next;setStudioState(next);
    if(previous.itemIndex===null)window.history.pushState({portfolioRoom:'item'},'',portfolioUrl(hashForStudioState(next)));
    else window.history.replaceState({portfolioRoom:'item'},'',portfolioUrl(hashForStudioState(next)));
  }
  function selectAigcFolder(folderId:string){
    if(studioState.mode!=='collection'||studioState.phase!=='stable'||!(folderId in AIGC_COLLECTIONS))return;
    const content=collectionContent(folderId),activeItemIndex=content.initialIndex;
    const next:StudioState={mode:'inspect',zone:'aigc',collectionId:content.id,itemId:content.items[activeItemIndex].id,activeItemIndex,phase:'entering'};
    stateRef.current=next;setStudioState(next);
    window.history.pushState({portfolioAigc:'inspect'},'',portfolioUrl(hashForStudioState(next)));
  }

  function selectAigcInspect(itemId:string){
    const previous=stateRef.current;if(previous.mode==='room'){selectRoomItem(Number(itemId));return;}if(previous.mode!=='inspect')return;
    const content=collectionContent(previous.collectionId),activeItemIndex=content.items.findIndex(item=>item.id===itemId);
    if(activeItemIndex<0)return;
    const next:StudioState={...previous,itemId,activeItemIndex,phase:'entering'};
    stateRef.current=next;setStudioState(next);
    window.history.replaceState({portfolioAigc:'inspect'},'',portfolioUrl(hashForStudioState(next)));
  }

  function navigateAigcProject(delta:number){
    const previous=stateRef.current;
    if(previous.mode==='room'){
      if(previous.zone==='video')return;
      const count=previous.zone==='photography'?STUDIO_PHOTOS.length:STUDIO_WRITINGS.length;
      if(previous.itemIndex!==null){selectRoomItem((previous.itemIndex+delta+count)%count);return;}
      if(previous.zone==='photography'){const page=(previous.page+delta+3)%3;setStudioState({...previous,page,phase:'entering'});window.history.replaceState({...window.history.state,page},'',portfolioUrl(hashForStudioState(previous)));}return;
    }
    if(previous.mode!=='inspect')return;
    const items=collectionContent(previous.collectionId).items;
    const index=(previous.activeItemIndex+delta+items.length)%items.length;
    selectAigcInspect(items[index].id);
  }

  function onDirectorMilestone(milestone:DirectorMilestone){
    if(milestone==='idle'&&queuedHistoryState.current){const next=queuedHistoryState.current;queuedHistoryState.current=null;stateRef.current=next;setStudioState(next);return;}
    setStudioState(previous=>{
      if(milestone==='idle')return previous.mode==='idle'&&previous.phase==='stable'?previous:IDLE_STATE;
      if(previous.mode===milestone&&previous.phase==='stable')return previous;
      if(milestone==='collection'&&(previous.mode==='focus'||previous.mode==='collection'))return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'stable'};
      if(milestone==='room'&&previous.mode==='room')return {...previous,phase:'stable'};
      if(milestone==='inspect'&&previous.mode==='inspect')return {...previous,phase:'stable'};
      return previous;
    });
  }

  function requestAigcBack(){
    if(studioState.mode==='room'){
      const detail=studioState.itemIndex!==null;
      if(window.history.state?.portfolioRoom===(detail?'item':'collection'))window.history.back();
      else{const next:StudioState=detail?{...studioState,itemIndex:null,phase:'leaving'}:{mode:'idle',phase:'leaving'};setStudioState(next);window.history.replaceState(null,'',portfolioUrl(hashForStudioState(next)));}return;
    }
    if(studioState.mode==='inspect'){
      if(window.history.state?.portfolioAigc==='inspect')window.history.back();
      else{setStudioState({mode:'collection',zone:'aigc',collectionId:studioState.collectionId,phase:'leaving'});window.history.replaceState({portfolioAigc:'collection'},'',portfolioUrl('#aigc'));}
      return;
    }
    if(studioState.mode==='collection'||studioState.mode==='focus'){
      if(window.history.state?.portfolioAigc==='collection')window.history.back();
      else{setStudioState({mode:'idle',phase:'leaving'});window.history.replaceState(null,'',portfolioUrl());}
    }
  }

  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape'&&studioState.mode!=='idle'){event.preventDefault();requestAigcBack();}};
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[studioState]);

  const aigcActive=studioState.mode!=='idle'||studioState.phase==='leaving';
  const [isMobile,setIsMobile]=useState(false);
  const [readingDpr,setReadingDpr]=useState(1);
  // Motion keeps the economical buffer; a settled artwork gets screen-density pixels.
  // Bound unusually large displays to eight million pixels, then demand rendering stops.
  useEffect(()=>{const sync=()=>{setIsMobile(window.innerWidth<=700);setReadingDpr(Math.max(1,Math.min(window.devicePixelRatio||1,3,Math.sqrt(8_000_000/(window.innerWidth*window.innerHeight)))));};sync();window.addEventListener('resize',sync);return()=>window.removeEventListener('resize',sync);},[]);
  const content=collectionContent(studioState.mode==='inspect'?studioState.collectionId:'red-leaf');
  const currentItem=content.items[studioState.mode==='inspect'?studioState.activeItemIndex:content.initialIndex];
  const room=studioState.mode==='room'?studioState:null;
  const writing=room?.zone==='writing'&&room.itemIndex!==null?STUDIO_WRITINGS[room.itemIndex]:null;
  return <section className='studio-shell' aria-label='三维作品集工作台' data-studio-mode={studioState.mode} data-studio-phase={studioState.phase??'stable'}>
    <header className='studio-topbar'>
      <Link className='studio-brand' href='/' aria-label='罗叶馨梅，返回个人主页'>LUO YEXINMEI<span aria-hidden='true'>●</span></Link>
      <nav className='studio-topnav' aria-label='作品集导航'><Link href='/' aria-label='返回个人主页'>Home</Link><span aria-current='page'>Portfolio</span></nav>
    </header>

    <div className='studio-canvas-wrap'>
      <SceneBoundary onError={()=>setReady(true)}>
        <Canvas frameloop='demand' shadows dpr={(studioState.mode==='inspect'||studioState.mode==='room')&&studioState.phase==='stable'?readingDpr:isMobile?1:[1,1.25]} camera={{position:[0,3.75,17.4],fov:26,near:.05,far:160}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}>
          <Suspense fallback={null}><StudioScene studioState={studioState} onSelect={openZone} onSelectFolder={selectAigcFolder} onSelectInspect={selectAigcInspect} onProjectNavigate={navigateAigcProject} onDirectorMilestone={onDirectorMilestone} onReady={()=>setReady(true)}/></Suspense>
        </Canvas>
      </SceneBoundary>
    </div>

    {!ready&&<div className='studio-loading' role='status'><span aria-hidden='true'/><p>正在打开作品集</p></div>}

    <div className={'studio-view-controls'+(aigcActive?' is-hidden':'')}>
      <span>拖动旋转 · 点亮区域查看作品</span>
      <button type='button' onClick={()=>window.dispatchEvent(new Event('studio:reset'))} aria-label='恢复工作台正面视角' title='恢复正面视角'>
        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'><path d='M4 10a8 8 0 1 1 1.7 7.4M4 4v6h6'/></svg>
        <span>恢复视角</span>
      </button>
    </div>

    <nav className='studio-a11y-nav' aria-label='作品分类' inert={aigcActive}>
      <button onClick={()=>openZone('writing')}>文字作品</button>
      <button onClick={()=>openZone('photography')}>摄影作品</button>
      <button onClick={()=>openZone('aigc')}>视觉与 AIGC</button>
      <button onClick={()=>openZone('video')}>视频作品</button>
    </nav>

    {aigcActive&&<>
      <button className='studio-aigc-back' type='button' onClick={requestAigcBack} aria-label='返回上一步'>← {studioState.mode==='inspect'?'视觉项目':room?.itemIndex!==null&&room?.itemIndex!==undefined?(room.zone==='photography'?'照片墙':'书架'):'工作台'}</button>
      {studioState.mode==='inspect'&&<>
        <aside className='studio-aigc-project-note' aria-label='项目信息'>
          <div><h1>{content.title} <span>{content.englishTitle}</span></h1><p>{content.description}<span>{content.credit}</span></p></div>
        </aside>
        <nav className='studio-aigc-hud' aria-label='作品浏览'>
          <button type='button' onClick={()=>navigateAigcProject(-1)} aria-label='上一张作品'>←</button>
          <div className='studio-aigc-caption' aria-live='polite'>
            <span>{String(studioState.activeItemIndex+1).padStart(2,'0')} / {String(content.items.length).padStart(2,'0')} · {currentItem.title}</span>
            <strong>{currentItem.caption}</strong>
            <small>{textureStatus[currentItem.id]==='error'?<button className='studio-texture-retry' onClick={()=>window.dispatchEvent(new Event('studio:retry-textures'))}>图片加载失败 · 重试</button>:textureStatus[currentItem.id]==='loading'?'正在加载清晰画面…':'左右切换作品'}<a className='studio-aigc-action' href={currentItem.href} target='_blank' rel='noopener noreferrer'>{currentItem.cta} ↗</a></small>
          </div>
          <button type='button' onClick={()=>navigateAigcProject(1)} aria-label='下一张作品'>→</button>
        </nav>
      </>}
      {studioState.mode==='collection'&&<nav className='studio-a11y-nav' aria-label='打开视觉项目'>{Object.values(AIGC_COLLECTIONS).map(item=><button key={item.id} onClick={()=>selectAigcFolder(item.id)}>展开{item.title} · {item.items.length} 张作品</button>)}</nav>}
      {studioState.mode==='collection'&&<p className='studio-aigc-collection-hint'>视觉与 AIGC <span>选择文件夹，展开项目</span></p>}
    </>}

    {room&&<>
      <aside className='studio-room-title'><h1>{room.zone==='photography'?'摄影记录':room.zone==='writing'?'文字作品':STUDIO_VIDEO.title}</h1><p>{room.zone==='photography'?'人像 · 剧场 · 现场 · 商业':room.zone==='writing'?'剧本、报道与传播研究':STUDIO_VIDEO.subtitle}</p></aside>
      {room.zone==='writing'&&room.itemIndex===null&&<nav className='studio-a11y-nav' aria-label='选择文字作品'>{STUDIO_WRITINGS.map((item,index)=><button key={item.id} onClick={()=>selectRoomItem(index)}><span>{item.kind}</span>{item.title}</button>)}</nav>}
      {room.zone==='writing'&&room.itemIndex===null&&<p className='studio-aigc-collection-hint'>选择一本书<span>展开刊发节选与作品档案</span></p>}
      {writing&&<nav className='studio-aigc-hud studio-room-hud' aria-label='文字作品浏览'><button aria-label='上一篇作品' onClick={()=>navigateAigcProject(-1)}>←</button><div className='studio-aigc-caption'><span>{writing.subtitle}</span><strong>{writing.title}</strong><small><a className='studio-aigc-action' target='_blank' rel='noopener noreferrer' href={writing.href}>{writing.action} ↗</a></small></div><button aria-label='下一篇作品' onClick={()=>navigateAigcProject(1)}>→</button></nav>}
      {room.zone==='photography'&&<nav className='studio-aigc-hud studio-room-hud' aria-label='照片浏览'>
       {(room.itemIndex!==null||isMobile)&&<button aria-label='上一张照片' onClick={()=>navigateAigcProject(-1)}>←</button>}
       <div className='studio-aigc-caption'><span>{room.itemIndex===null?'PHOTOGRAPHY · 16 PHOTOGRAPHS':`${room.itemIndex+1} / ${STUDIO_PHOTOS.length}`}</span><strong>{room.itemIndex===null?'点选照片，靠近观看':STUDIO_PHOTOS[room.itemIndex].title}</strong><small>{roomTextureError?<button className='studio-texture-retry' onClick={()=>{setRoomTextureError(false);window.dispatchEvent(new Event('studio:retry-textures'));}}>图片加载失败 · 重试</button>:room.itemIndex===null?(isMobile?`第 ${room.page+1} / 3 组 · 左右滑动切换`:'从洞洞板延展的影像记录'):'左右滑动或使用方向键切换'}</small></div>
       {(room.itemIndex!==null||isMobile)&&<button aria-label='下一张照片' onClick={()=>navigateAigcProject(1)}>→</button>}
      </nav>}
      {room.zone==='video'&&<StudioVideoControls/>}
      {room.zone==='photography'&&<nav className='studio-a11y-nav' aria-label='选择照片'>{STUDIO_PHOTOS.map((item,index)=><button key={item.id} onClick={()=>selectRoomItem(index)}>{item.title}</button>)}</nav>}
      {writing&&<div className='studio-a11y-nav'><h2>{writing.heading}</h2><p>{writing.excerpt}</p></div>}
    </>}

  </section>;
}
