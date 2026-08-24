'use client';

import {useEffect} from 'react';
import {resumeLiveLocationSession} from '@/lib/location';

// The locale layout survives page changes. Keeping the watcher here means Discover,
// store detail and review creation all share the same device-location session.
export function LocationSessionKeeper(){
  useEffect(()=>{resumeLiveLocationSession();},[]);
  return null;
}
