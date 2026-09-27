'use client';

import {Canvas} from '@react-three/fiber';
import {Component,Suspense,useEffect,useRef,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {StudioScene,type PortfolioZoneId} from './studio-scene';
import {PortfolioExhibitOverlay,type ExhibitZone} from './portfolio-exhibit-overlay';
import {IDLE_STATE,stateFromHash,studioDepth,studioStateLabel,type StudioState} from './studio-state';
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
  const [ready,setReady]=useState(false);

  function clearTimer(){if(timer.current){clearTimeout(timer.current);timer.current=null;}}

  useEffect(()=>{
    function syncFromHistory(){
      clearTimer();
      const aigc=stateFromHash(window.location.hash);
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
    if(direct){
      setSelected(direct);
      timer.current=setTimeout(()=>setExhibitVisible(true),180);
    }
    window.addEventListener('popstate',syncFromHistory);
    window.addEventListener('hashchange',syncFromHistory);
    return()=>{clearTimer();window.removeEventListener('popstate',syncFromHistory);window.removeEventListener('hashchange',syncFromHistory);};
  },[]);

  function openZone(id:PortfolioZoneId){
    clearTimer();
    if(id==='aigc'){
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

  function selectAigcItem(folderId:string){
    if(studioState.mode!=='collection')return;
    const itemId=folderId==='red-leaf'?'gameplay-scene':folderId;
    const next:StudioState={mode:'item',zone:'aigc',collectionId:'red-leaf',itemId,phase:'entering'};
    setStudioState(next);window.history.pushState({portfolioAigc:'item'},'',portfolioUrl('#aigc/red-leaf/gameplay-scene'));
  }

  function onDirectorMilestone(milestone:DirectorMilestone){
    setStudioState(previous=>{
      if(milestone==='idle')return IDLE_STATE;
      if(milestone==='collection'&&(previous.mode==='focus'||previous.mode==='collection'))return {mode:'collection',zone:'aigc',collectionId:'red-leaf',phase:'stable'};
      if(milestone==='item'&&previous.mode==='item')return {...previous,phase:'stable'};
      return previous;
    });
  }

  function requestAigcBack(){
    if(studioState.mode==='item'){
      if(window.history.state?.portfolioAigc==='item')window.history.back();
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
  return <section className={'studio-shell'+(exhibitVisible?' is-exhibiting':'')} aria-label='三维作品集工作台' data-studio-mode={studioState.mode} data-studio-phase={studioState.phase??'stable'}>
    <header className='studio-topbar'>
      <Link className='studio-brand' href='/' aria-label='罗叶馨梅，返回个人主页'>LUO YEXINMEI<span aria-hidden='true'>●</span></Link>
      <nav className='studio-topnav' aria-label='作品集导航'><Link href='/' aria-label='返回个人主页'>Home</Link><span aria-current='page'>Portfolio</span></nav>
    </header>

    <div className='studio-canvas-wrap' aria-hidden={exhibitVisible}>
      <SceneBoundary onError={()=>setReady(true)}>
        <Canvas frameloop='demand' shadows dpr={[1,1.5]} camera={{position:[0,3.75,17.4],fov:26,near:.05,far:160}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}>
          <Suspense fallback={null}><StudioScene selected={selected} studioState={studioState} onSelect={openZone} onSelectItem={selectAigcItem} onDirectorMilestone={onDirectorMilestone} onReady={()=>setReady(true)}/></Suspense>
        </Canvas>
      </SceneBoundary>
    </div>

    {!ready&&<div className='studio-loading' role='status'><span aria-hidden='true'/><p>正在打开作品集</p></div>}

    <div className='studio-view-controls'>
      <span>拖动旋转 · 点亮区域查看作品</span>
      <button type='button' onClick={()=>window.dispatchEvent(new Event('studio:reset'))} aria-label='恢复工作台正面视角' title='恢复正面视角'>
        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'><path d='M4 10a8 8 0 1 1 1.7 7.4M4 4v6h6'/></svg>
        <span>恢复视角</span>
      </button>
    </div>

    <nav className='studio-a11y-nav' aria-label='作品分类'>
      <button onClick={()=>openZone('writing')}>文字作品</button>
      <button onClick={()=>openZone('photography')}>摄影作品</button>
      <button onClick={()=>openZone('aigc')}>视觉与 AIGC</button>
      <button onClick={()=>openZone('video')}>视频作品</button>
    </nav>

    {aigcActive&&<div className='studio-aigc-hud' role='status' aria-live='polite'>
      <button type='button' onClick={requestAigcBack} aria-label='返回上一步'>返回</button>
      <span>{studioStateLabel(studioState)}</span>
    </div>}

    {exhibitVisible&&selected&&<PortfolioExhibitOverlay zone={selected} onZoneChange={switchZone} onClose={closeExhibit}/>}
  </section>;
}
