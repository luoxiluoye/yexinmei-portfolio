'use client';
import {Canvas} from '@react-three/fiber';
import {Component,Suspense,useEffect,useRef,useState,type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {StudioScene,type PortfolioZoneId} from './studio-scene';
const routeByZone:Record<PortfolioZoneId,string>={writing:'/portfolio/writing',photography:'/portfolio/photography',aigc:'/portfolio/aigc',video:'/portfolio/video'};
class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 componentDidCatch(){this.props.onError();}
 render(){return this.state.failed?<div className='studio-fallback'><p>三维场景未能加载。</p><a href='/portfolio/photography'>打开摄影作品</a><button onClick={()=>window.location.reload()}>重新加载</button></div>:this.props.children;}
}
export function PortfolioStudio(){
 const router=useRouter(),timer=useRef<ReturnType<typeof setTimeout>|null>(null),navigating=useRef(false);
 const [selected,setSelected]=useState<PortfolioZoneId|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{Object.values(routeByZone).forEach(route=>router.prefetch(route));return()=>{if(timer.current)clearTimeout(timer.current);};},[router]);
 function openZone(id:PortfolioZoneId){if(navigating.current)return;navigating.current=true;setSelected(id);const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:620;timer.current=setTimeout(()=>router.push(routeByZone[id]),duration);}
 return <section className='studio-shell' aria-label='三维作品集工作台'>
  <header className='studio-topbar'><Link className='studio-brand' href='/' aria-label='罗叶馨梅，返回个人主页'>LUO YEXINMEI<span aria-hidden='true'>●</span></Link><nav className='studio-topnav' aria-label='作品集导航'><Link href='/' aria-label='返回个人主页'>Home</Link><span aria-current='page'>Portfolio</span></nav></header>
  <div className='studio-canvas-wrap' aria-hidden='true'><SceneBoundary onError={()=>setReady(true)}><Canvas frameloop='demand' shadows dpr={[1,1.5]} camera={{position:[0,3.75,17.1],fov:26,near:.05,far:160}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}><Suspense fallback={null}><StudioScene selected={selected} onSelect={openZone} onReady={()=>setReady(true)}/></Suspense></Canvas></SceneBoundary></div>
  {!ready&&<div className='studio-loading' role='status'><span aria-hidden='true'/><p>正在打开作品集</p></div>}
  <nav className='studio-a11y-nav' aria-label='作品分类'><button onClick={()=>openZone('writing')}>文字作品</button><button onClick={()=>openZone('photography')}>摄影作品</button><button onClick={()=>openZone('aigc')}>AIGC 视觉</button><button onClick={()=>openZone('video')}>视频作品</button></nav>
  <div className={`studio-route-wash ${selected?'is-visible':''}`} aria-hidden='true'/>
 </section>;
}
