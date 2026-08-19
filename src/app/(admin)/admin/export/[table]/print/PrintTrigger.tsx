'use client';
import {useEffect} from 'react';

// Opens the print dialog once the table has rendered. The button stays as well, because a
// dialog that opens by itself is easy to dismiss by accident and there must be a way back.
export function PrintTrigger(){
  useEffect(()=>{
    const timer=window.setTimeout(()=>window.print(),400);
    return()=>window.clearTimeout(timer);
  },[]);
  return <button className="print-button" onClick={()=>window.print()}>Yazdır / PDF olarak kaydet</button>;
}
