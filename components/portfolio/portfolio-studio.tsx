'use client';

import {Canvas} from '@react-three/fiber';
import {Component,Suspense,useEffect,useRef,useState,type ReactNode} from 'react';
import Link from 'next/link';
import {StudioScene,type PortfolioZoneId} from './studio-scene';
import {PortfolioExhibitOverlay,type ExhibitZone} from './portfolio-exhibit-overlay';
import '../../styles/portfolio-interactions.css';

const ZONES:PortfolioZoneId[]=['writing','photography','aigc','video'];

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
  const [ready,setReady]=useState(false);

  function clearTimer(){if(timer.current){clearTimeout(timer.current);timer.current=null;}}

  useEffect(()=>{
    function syncFromHistory(){
      clearTimer();
      const zone=zoneFromHash();
      if(zone){
        setSelected(zone);
        timer.current=setTimeout(()=>setExhibitVisible(true),80);
      }else{
        setExhibitVisible(false);
        timer.current=setTimeout(()=>setSelected(null),330);
      }
    }
    const direct=zoneFromHash();
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
    setSelected(id);
    const url='/portfolio#'+id;
    if(window.location.hash==='#'+id)window.history.replaceState({portfolioExhibit:true},'',url);
    else window.history.pushState({portfolioExhibit:true},'',url);
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current=setTimeout(()=>setExhibitVisible(true),reduce?0:410);
  }

  function switchZone(id:ExhibitZone){
    clearTimer();
    setSelected(id);
    setExhibitVisible(true);
    window.history.replaceState({portfolioExhibit:true},'','/portfolio#'+id);
  }

  function closeExhibit(){
    clearTimer();
    setExhibitVisible(false);
    const wasOpenedHere=Boolean(window.history.state?.portfolioExhibit);
    if(wasOpenedHere)window.history.back();
    else window.history.replaceState(null,'','/portfolio');
    timer.current=setTimeout(()=>setSelected(null),330);
  }

  return <section className={'studio-shell'+(exhibitVisible?' is-exhibiting':'')} aria-label='三维作品集工作台'>
    <header className='studio-topbar'>
      <Link className='studio-brand' href='/' aria-label='罗叶馨梅，返回个人主页'>LUO YEXINMEI<span aria-hidden='true'>●</span></Link>
      <nav className='studio-topnav' aria-label='作品集导航'><Link href='/' aria-label='返回个人主页'>Home</Link><span aria-current='page'>Portfolio</span></nav>
    </header>

    <div className='studio-canvas-wrap' aria-hidden={exhibitVisible}>
      <SceneBoundary onError={()=>setReady(true)}>
        <Canvas frameloop='demand' shadows dpr={[1,1.5]} camera={{position:[0,3.75,17.4],fov:26,near:.05,far:160}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}>
          <Suspense fallback={null}><StudioScene selected={selected} onSelect={openZone} onReady={()=>setReady(true)}/></Suspense>
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

    {exhibitVisible&&selected&&<PortfolioExhibitOverlay zone={selected} onZoneChange={switchZone} onClose={closeExhibit}/>}
  </section>;
}
