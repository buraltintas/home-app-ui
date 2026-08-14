'use client';
import {Bookmark,Map,PenLine,Share2} from 'lucide-react';import {useState} from 'react';import {useI18n} from '@/i18n/I18nProvider';import {AuthDialog} from './AuthDialog';
export function StoreActions(){const {t}=useI18n();const [auth,setAuth]=useState(false);return <><div className="store-actions"><button onClick={()=>setAuth(true)}><Bookmark/>{t('save')}</button><button><Map/>{t('directions')}</button><button onClick={()=>setAuth(true)}><PenLine/>{t('review')}</button><button><Share2/>{t('share')}</button></div><AuthDialog open={auth} onClose={()=>setAuth(false)}/></>}

