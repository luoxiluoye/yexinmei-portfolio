'use client';

import {Canvas} from '@react-three/fiber';
import {Component,Suspense,useEffect,useRef,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {StudioScene,type PortfolioZoneId} from './studio-scene';
import {PortfolioExhibitOverlay,type ExhibitZone} from './portfolio-exhibit-overlay';
import {IDLE_STATE,stateFromHash,studioDepth,type StudioState} from './studio-state';
import {RED_LEAF_ITEMS,RED_LEAF_URL} from './aigc-content';
import {AIGC_HIRES} from './model/workbench';
import type {DirectorMilestone} from './studio-director';
import '../../styles/portfolio-interactions.css';

const ZONES:PortfolioZoneId[]=['writing','photography','aigc','video'];
function portfolioUrl(hash=''){if(typeof window==='undefined')return '/portfolio'+hash;return window.location.pathname+window.location.search+hash;}

function zoneFromHash():PortfolioZoneId|null{
  if(typeof window==='undefined')return null;
  const value=window.location.hash.replace('#','') as PortfolioZoneId;
  return ZONES.includes(value)?value:null;
}

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
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const [selected,setSelected]=useState<PortfolioZoneId|null>(null);
  const [exhibitVisible,setExhibitVisible]=useState(false);
  const [studioState,setStudioState]=useState<StudioState>(IDLE_STATE);
  const stateRef=useRef(studioState);stateRef.current=studioState;
  const [ready,setReady]=useState(false);
  const [textureStatus,setTextureStatus]=useState<Record<string,string>>({});
  useEffect(()=>{const update=(event:Event)=>{const {id,status}=(event as CustomEvent<{id:string;status:string}>).detail;setTextureStatus(previous=>({...previous,[id]:status}));};window.addEventListener('studio:texture-status',update);return()=>window.removeEventListener('studio:texture-status',update);},[]);

  function clearTimer(){if(timer.current){clearTimeout(timer.current);timer.current=null;}}

  useEffect(()=>{
    function syncFromHistory(){
      clearTimer();
      let aigc=stateFromHash(window.location.hash);
      if(aigc.mode==='project'&&typeof window.history.state?.activeItemIndex==='number')aigc={...aigc,activeItemIndex:window.history.state.activeItemIndex};
      if(aigc.mode!=='idle'){
        setExhibitVisible(false);setSelected(null);setStudioState(previous=>({...aigc,phase:studioDepth(aigc)>studioDepth(previous)?'entering':'leaving'} as StudioState));return;
      }
      const zone=zoneFromHash();
      if(zone){
        setSelected(zone);
        timer.current=setTimeout(()=>setExhibitVisible(true),80);
      }else{
        setExhibitVisible(false);setStudioState(previous=>studioDepth(previous)>0||previous.phase==='leaving'?{mode:'idle',phase:'leaving'}:IDLE_STATE);
        timer.current=setTimeout(()=>setSelected(null),330);
      }
    }
    const direct=zoneFromHash();
    const directAigc=stateFromHash(window.location.hash);
    if(directAigc.mode!=='idle')setStudioState(directAigc);
    if(direct&&direct!=='aigc'){
      setSelected(direct);
      timer.current=setTimeout(()=>setExhibitVisible(true),180);
    }
    const localRoute=window.location.pathname+window.location.search;
    // next-view-transitions starts a document snapshot for every popstate. Our
    // same-document hashes already have a reversible Three animation; a second
    // transition can freeze pointer input (especially with reduced motion).
    function onHistory(event:PopStateEvent){
      const isLocal=window.location.pathname+window.location.search===localRoute;
      const isAigc=stateRef.current.mode!=='idle'||window.location.hash.startsWith('#aigc');
      if(isLocal&&isAigc){event.stopImmediatePropagation();syncFromHistory();}
    }
    window.addEventListener('popstate',onHistory,true);
    window.addEventListener('popstate',syncFromHistory);
    window.addEventListener('hashchange',syncFromHistory);
    return()=>{clearTimer();window.removeEventListener('popstate',onHistory,true);window.removeEventListener('popstate',syncFromHistory);window.removeEventListener('hashchange',syncFromHistory);};
  },[]);

  function openZone(id:PortfolioZoneId){
    clearTimer();
    if(id==='aigc'){
      if(studioState.mode!=='idle')return;
      setExhibitVisible(false);setSelected(null);setStudioState({mode:'focus',zone:'aigc',phase:'entering'});
      window.history.pushState({portfolioAigc:'collection'},'',portfolioUrl('#aigc'));return;
    }
    setSelected(id);
    const url=portfolioUrl('#'+id);
    if(window.location.hash==='#'+id)window.history.replaceState({portfolioExhibit:true},'',url);
    else window.history.pushState({portfolioExhibit:true},'',url);
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current=setTimeout(()=>setExhibitVisible(true),reduce?0:410);
  }

  function switchZone(id:ExhibitZone){
    clearTimer();
    if(id==='aigc'){openZone('aigc');return;}
    setSelected(id);
    setExhibitVisible(true);
    window.history.replaceState({portfolioExhibit:true},'',portfolioUrl('#'+id));
  }

  function selectAigcFolder(folderId:string){
    if(studioState.mode!=='collection'||folderId!=='red-leaf')return;
    const next:StudioState={mode:'project',zone:'aigc',collectionId:'red-leaf',activeItemIndex:1,phase:'entering'};
    setStudioState(next);window.history.pushState({portfolioAigc:'project',activeItemIndex:1},'',portfolioUrl('#aigc/red-leaf'));
  }

  function selectAigcInspect(itemId:string){
    if(studioState.mode!=='project'&&studioState.mode!=='inspect')return;
    const activeItemIndex=RED_LEAF_ITEMS.findIndex(item=>item.id===itemId);if(activeItemIndex<0)return;
    const next:StudioState={mode:'inspect',zone:'aigc',collectionId:'red-leaf',itemId,activeItemIndex,phase:'entering'};
    if(studioState.mode==='project'){
      window.history.replaceState({portfolioAigc:'project',activeItemIndex:studioState.activeItemIndex},'',portfolioUrl('#aigc/red-leaf'));
      window.history.pushState({portfolioAigc:'inspect'},'',portfolioUrl(`#aigc/red-leaf/${itemId}`));
    }else window.history.replaceState({portfolioAigc:'inspect'},'',portfolioUrl(`#aigc/red-leaf/${itemId}`));
    setStudioState(next);
  }

  function navigateAigcProject(delta:number){
    const previous=stateRef.current;
    if(previous.mode!=='project'&&previous.mode!=='inspect')return;
    const activeItemIndex=(previous.activeItemIndex+delta+RED_LEAF_ITEMS.length)%RED_LEAF_ITEMS.length;
    const itemId=RED_LEAF_ITEMS[activeItemIndex].id;
    const next={...previous,activeItemIndex,...(previous.mode==='inspect'?{itemId}:{}),phase:'entering'} as StudioState;
    stateRef.current=next;setStudioState(next);
    window.history.replaceState({portfolioAigc:previous.mode,activeItemIndex},'',portfolioUrl(previous.mode==='inspect'?`#aigc/red-leaf/${itemId}`:'#aigc/red-leaf'));
  }

  function onDirectorMilestone(milestone:DirectorMilestone){
    setStudioState(previous=>{
      if(milestone==='idle')return previous.mode==='idle'&&previous.phase==='stable'?previous:IDLE_STATE;
      if(previous.mode===milestone&&previous.phase==='stable')return previous;
      if(milestone==='collection'&&(previous.mode==='focus'||previous.mode==='collection'))return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'stable'};
      if(milestone==='project'&&previous.mode==='project')return {...previous,phase:'stable'};
      if(milestone==='inspect'&&previous.mode==='inspect')return {...previous,phase:'stable'};
      return previous;
    });
  }

  function requestAigcBack(){
    if(studioState.mode==='inspect'){
      if(window.history.state?.portfolioAigc==='inspect')window.history.back();
      else{setStudioState({mode:'project',zone:'aigc',collectionId:'red-leaf',activeItemIndex:studioState.activeItemIndex,phase:'leaving'});window.history.replaceState({portfolioAigc:'project',activeItemIndex:studioState.activeItemIndex},'',portfolioUrl('#aigc/red-leaf'));}
      return;
    }
    if(studioState.mode==='project'){
      if(window.history.state?.portfolioAigc==='project')window.history.back();
      else{setStudioState({mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'leaving'});window.history.replaceState({portfolioAigc:'collection'},'',portfolioUrl('#aigc'));}
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

  function closeExhibit(){
    clearTimer();
    setExhibitVisible(false);
    const wasOpenedHere=Boolean(window.history.state?.portfolioExhibit);
    if(wasOpenedHere)window.history.back();
    else window.history.replaceState(null,'',portfolioUrl());
    timer.current=setTimeout(()=>setSelected(null),330);
  }

  const aigcActive=studioState.mode!=='idle'||studioState.phase==='leaving';
  const [isMobile,setIsMobile]=useState(false);
  useEffect(()=>{const query=window.matchMedia('(max-width:700px)');const sync=()=>setIsMobile(query.matches);sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync);},[]);
  return <section className={'studio-shell'+(exhibitVisible?' is-exhibiting':'')} aria-label='三维作品集工作台' data-studio-mode={studioState.mode} data-studio-phase={studioState.phase??'stable'}>
    <header className='studio-topbar'>
      <Link className='studio-brand' href='/' aria-label='罗叶馨梅，返回个人主页'>LUO YEXINMEI<span aria-hidden='true'>●</span></Link>
      <nav className='studio-topnav' aria-label='作品集导航'><Link href='/' aria-label='返回个人主页'>Home</Link><span aria-current='page'>Portfolio</span></nav>
    </header>

    <div className='studio-canvas-wrap' aria-hidden={exhibitVisible}>
      <SceneBoundary onError={()=>setReady(true)}>
        <Canvas frameloop='demand' shadows dpr={isMobile?1:[1,1.25]} camera={{position:[0,3.75,17.4],fov:26,near:.05,far:160}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}>
          <Suspense fallback={null}><StudioScene selected={selected} studioState={studioState} onSelect={openZone} onSelectFolder={selectAigcFolder} onSelectInspect={selectAigcInspect} onProjectNavigate={navigateAigcProject} onDirectorMilestone={onDirectorMilestone} onReady={()=>setReady(true)}/></Suspense>
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
      <button className='studio-aigc-back' type='button' onClick={requestAigcBack} aria-label='返回上一步'>← {studioState.mode==='inspect'?'项目总览':studioState.mode==='project'?'视觉项目':'工作台'}</button>
      {(studioState.mode==='project'||studioState.mode==='inspect')&&<>
        <aside className='studio-aigc-project-note' aria-label='赤页项目信息'>
          <div><h1>赤页 <span>RED LEAF</span></h1><p>把故事变成可以游玩的文字冒险。<span>AI 互动叙事产品 · 独立设计与开发</span></p></div>
          <a href={RED_LEAF_URL} target='_blank' rel='noopener noreferrer'>在线体验 ↗</a>
        </aside>
        <nav className='studio-aigc-hud' aria-label='作品浏览'>
          <button type='button' onClick={()=>navigateAigcProject(-1)} aria-label='上一张作品'>←</button>
          <div className='studio-aigc-caption' aria-live='polite'><span>{String(studioState.activeItemIndex+1).padStart(2,'0')} / 05 · {RED_LEAF_ITEMS[studioState.activeItemIndex].title}</span><strong>{RED_LEAF_ITEMS[studioState.activeItemIndex].caption}</strong><small>{textureStatus[RED_LEAF_ITEMS[studioState.activeItemIndex].id]==='error'?<button className='studio-texture-retry' onClick={()=>window.dispatchEvent(new Event('studio:retry-textures'))}>图片加载失败 · 重试</button>:textureStatus[RED_LEAF_ITEMS[studioState.activeItemIndex].id]==='loading'?'正在加载清晰原图…':studioState.mode==='inspect'?'放大查看 · 可直接切换作品':'点击纸张放大 · 左右滑动浏览'}{studioState.mode==='inspect'&&<> · <a href={AIGC_HIRES[studioState.activeItemIndex]} target='_blank' rel='noopener noreferrer'>查看原图 ↗</a></>}</small></div>
          <button type='button' onClick={()=>navigateAigcProject(1)} aria-label='下一张作品'>→</button>
        </nav>
      </>}
      {studioState.mode==='collection'&&<nav className='studio-a11y-nav' aria-label='打开视觉项目'><button onClick={()=>selectAigcFolder('red-leaf')}>展开赤页 · 5 张作品</button></nav>}
      {studioState.mode==='collection'&&<p className='studio-aigc-collection-hint'>视觉与 AIGC <span>选择文件夹，展开项目</span></p>}
    </>}

    {exhibitVisible&&selected&&<PortfolioExhibitOverlay zone={selected} onZoneChange={switchZone} onClose={closeExhibit}/>}
  </section>;
}
