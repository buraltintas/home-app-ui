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
    // A row with nothing past its edge still gets a bar, and the bar fills it. Hiding it was
    // the more fastidious answer -- a scrollbar that cannot scroll is a control that does
    // nothing -- but it made the bar appear and disappear from one shop to the next depending
    // on how many reviews they had, which reads as the bar being broken. Full width says
    // "this is all of it", which is true and is what a scrollbar is for.
    if(scrollWidth<=clientWidth+1){setThumb({width:100,left:0});return;}
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
    // The cards carry a disclosure that changes their height, not their width -- but the
    // fonts arriving does change it, and so does a photograph loading. Measure once more
    // after the page has settled rather than trusting the first frame.
    const settle=window.setTimeout(measure,600);
    return()=>{window.clearTimeout(settle);element.removeEventListener('scroll',measure);observer.disconnect();};
  },[measure]);

  return <>
    <div className="store-review-rail" ref={rail}>{children}</div>
    <div className="store-review-scrollbar" role="presentation" aria-hidden="true" aria-label={label}>
      <span style={{width:`${thumb.width}%`,left:`${thumb.left}%`}}/>
    </div>
  </>;
}
