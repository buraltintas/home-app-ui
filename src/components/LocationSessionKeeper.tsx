'use client';

import {useEffect} from 'react';
import {resumeLiveLocationSession} from '@/lib/location';

// The locale layout survives page changes. Keeping the watcher here means Discover,
// store detail and review creation all share one device-location preference, including
// after the app is reopened when the browser still owns a valid permission grant.
export function LocationSessionKeeper(){
  useEffect(()=>{void resumeLiveLocationSession();},[]);
  return null;
}
