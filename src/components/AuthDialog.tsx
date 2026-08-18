'use client';

import Script from 'next/script';
import {FormEvent,useCallback,useEffect,useRef,useState} from 'react';
import {ArrowLeft,X} from 'lucide-react';
import {useI18n} from '@/i18n/I18nProvider';

type GoogleCredentialResponse={credential?:string};
type GoogleIdentity={accounts:{id:{initialize:(options:{client_id:string;callback:(response:GoogleCredentialResponse)=>void})=>void;renderButton:(element:HTMLElement,options:{type:'standard';theme:'outline';size:'large';text:'continue_with';shape:'rectangular';logo_alignment:'left';width:string})=>void}}};

declare global{interface Window{google?:GoogleIdentity}}

export function AuthDialog({open,onClose,onAuthenticated}:{open:boolean;onClose:()=>void;onAuthenticated?:()=>void}){
  const {t,locale}=useI18n();
  const googleButtonRef=useRef<HTMLDivElement>(null);
  const googleCallbackRef=useRef<(response:GoogleCredentialResponse)=>void>(()=>undefined);
  const googleInitializedRef=useRef(false);
  const [googleReady,setGoogleReady]=useState(false);
  const [emailMode,setEmailMode]=useState(false);
  const [sent,setSent]=useState(false);
  const [email,setEmail]=useState('');
  const [code,setCode]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const googleClientId=process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const resetFlow=useCallback(()=>{setEmailMode(false);setSent(false);setEmail('');setCode('');setError('');setBusy(false)},[]);
  const closeDialog=useCallback(()=>{resetFlow();onClose()},[onClose,resetFlow]);
  const completeAuthentication=useCallback(()=>{window.dispatchEvent(new Event('bosagezme:authenticated'));onAuthenticated?.();closeDialog()},[closeDialog,onAuthenticated]);
  const authenticateWithGoogle=useCallback(async({credential}:GoogleCredentialResponse)=>{
    if(!credential){setError(t('authError'));return}
    setBusy(true);setError('');
    try{
      const response=await fetch('/api/auth/google',{method:'POST',headers:{'content-type':'application/json','x-locale':locale},body:JSON.stringify({id_token:credential})});
      if(!response.ok){const body=await response.json();throw new Error(body?.error?.message??t('authError'))}
      completeAuthentication();
    }catch(reason){setError(reason instanceof Error?reason.message:t('authError'))}
    finally{setBusy(false)}
  },[completeAuthentication,locale,t]);
  useEffect(()=>{googleCallbackRef.current=response=>void authenticateWithGoogle(response)},[authenticateWithGoogle]);

  useEffect(()=>{
    if(!open||emailMode||!googleReady||!googleClientId||!window.google||!googleButtonRef.current)return;
    const container=googleButtonRef.current;
    container.replaceChildren();
    if(!googleInitializedRef.current){window.google.accounts.id.initialize({client_id:googleClientId,callback:response=>googleCallbackRef.current(response)});googleInitializedRef.current=true}
    window.google.accounts.id.renderButton(container,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'left',width:String(Math.min(388,container.clientWidth))});
  },[authenticateWithGoogle,emailMode,googleClientId,googleReady,locale,open]);

  if(!open)return null;

  async function submit(event:FormEvent){
    event.preventDefault();setBusy(true);setError('');
    try{
      const response=await fetch(sent?'/api/auth/verify-code':'/api/auth/request-code',{method:'POST',headers:{'content-type':'application/json','x-locale':locale},body:JSON.stringify(sent?{email,code}:{email})});
      if(!response.ok){const body=await response.json();throw new Error(body?.error?.message??t('authError'))}
      if(sent)completeAuthentication();else setSent(true);
    }catch(reason){setError(reason instanceof Error?reason.message:t('authError'))}
    finally{setBusy(false)}
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={closeDialog}>
    <Script id={`google-identity-${locale}`} src={`https://accounts.google.com/gsi/client?hl=${locale}`} strategy="afterInteractive" onLoad={()=>{googleInitializedRef.current=false;setGoogleReady(false);window.setTimeout(()=>setGoogleReady(true),0)}} onError={()=>setError(t('googleUnavailable'))}/>
    <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-busy={busy} onMouseDown={event=>event.stopPropagation()}>
      <button className="icon-button dialog-close" onClick={closeDialog} aria-label={t('close')}><X/></button>
      <p className="eyebrow">{t('wordmark')}</p>
      <h2 id="auth-title">{emailMode?(sent?t('codeTitle'):t('emailTitle')):t('signInTitle')}</h2>
      {emailMode?<form onSubmit={submit}>
        <p>{sent?email:t('emailBody')}</p>
        {sent&&<button type="button" onClick={()=>{setSent(false);setCode('');setError('')}} style={{minHeight:44,border:0,padding:0,background:'transparent',color:'var(--accent)',display:'inline-flex',alignItems:'center',gap:8,fontWeight:700}}><ArrowLeft size={18}/>{t('backToEmail')}</button>}
        <label><span>{sent?t('codeLabel'):t('emailTitle')}</span><input required value={sent?code:email} onChange={event=>sent?setCode(event.target.value.replace(/\D/g,'').slice(0,6)):setEmail(event.target.value)} type={sent?'text':'email'} inputMode={sent?'numeric':'email'} maxLength={sent?6:254} placeholder={sent?'000000':'name@example.com'}/></label>
        {error&&<p role="alert">{error}</p>}
        <button disabled={busy||(sent&&code.length!==6)} className="button primary" type="submit">{busy?'…':sent?t('verify'):t('sendCode')}</button>
      </form>:<>
        <p>{t('signInBody')}</p>
        <div className="google-button-slot" ref={googleButtonRef} style={{width:'100%',minHeight:44,marginTop:10,overflow:'hidden'}}>{(!googleReady||!googleClientId)&&<button className="button secondary" style={{width:'100%',margin:0}} disabled>{t('google')}</button>}</div>
        {!googleClientId&&<p role="alert">{t('googleUnavailable')}</p>}
        {error&&<p role="alert">{error}</p>}
        <button className="button secondary" disabled={busy} onClick={()=>setEmailMode(true)}>{t('email')}</button>
        <button className="button quiet" disabled={busy} onClick={closeDialog}>{t('later')}</button>
      </>}
    </section>
  </div>
}
