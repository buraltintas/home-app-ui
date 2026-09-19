'use client';

import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';

// A scrollbar the phone cannot hide.
//
// The rail scrolls sideways, and on a phone the browser's own scrollbar is an overlay that
// fades out the moment you stop moving. A row that continues past the edge therefore reads,
// at rest, as a row that ends there -- which is every time somebody first looks at it.
// ::-webkit-scrollbar does not change that on iOS; the overlay is the operating system's and
// it is not ours to style.
//
// So the bar is drawn, and it is a real one: its width is the share of the row that fits on
// screen and its position is where in the row you are. Not a hint that there is more -- a
// readout of how much, which is the thing a scrollbar is for.
export function ReviewRail({children,label}:{children:ReactNode;label:string}){
  const rail=useRef<HTMLDivElement>(null);
  const [thumb,setThumb]=useState({width:0,left:0});

  const measure=useCallback(()=>{
    const element=rail.current;
    if(!element)return;
    const {scrollWidth,clientWidth,scrollLeft}=element;
    // Nothing past the edge is not a scrollbar with a full thumb -- it is no scrollbar.
    if(scrollWidth<=clientWidth+1){setThumb({width:0,left:0});return;}
    const width=Math.max(12,clientWidth/scrollWidth*100);
    const left=scrollLeft/(scrollWidth-clientWidth)*(100-width);
    setThumb({width,left:Math.min(100-width,Math.max(0,left))});
  },[]);

  useEffect(()=>{
    const element=rail.current;
    if(!element)return;
    measure();
    element.addEventListener('scroll',measure,{passive:true});
    // The share that fits changes with the width of the window, and with the fonts arriving.
    const observer=new ResizeObserver(measure);
    observer.observe(element);
    return()=>{element.removeEventListener('scroll',measure);observer.disconnect();};
  },[measure]);

  return <>
    <div className="store-review-rail" ref={rail}>{children}</div>
    {thumb.width>0&&<div className="store-review-scrollbar" role="presentation" aria-hidden="true" aria-label={label}>
      <span style={{width:`${thumb.width}%`,left:`${thumb.left}%`}}/>
    </div>}
  </>;
}
