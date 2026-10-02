'use client';

import {useEffect,useMemo,useState} from 'react';
import {MapPinPlus,MessageCircle,Quote,SquarePen} from 'lucide-react';
import {apiFetch} from '@/lib/api-client';
import {correctionWording} from '@/components/StoreCorrectionForm';
import type {FeedbackMessage,Locale} from '@/lib/types';

const copy:Record<Locale,{answered:string;empty:string;emptyKind:string;error:string;pending:string;reply:string;yours:string;feedback:string;correction:string;addition:string}>={
  tr:{answered:'Yanıtlandı',empty:'Henüz bize gönderdiğin bir mesaj yok.',emptyKind:'Bu türde gönderdiğin bir mesaj yok.',error:'Mesajların yüklenemedi. Tekrar dener misin?',pending:'Yanıt bekliyor',reply:'Boşa Gezme! yanıtı',yours:'Senin mesajın',feedback:'Görüş ve öneri',correction:'Mağaza bilgisi düzenleme',addition:'Mağaza ekleme'},
  en:{answered:'Answered',empty:'You have not sent us a message yet.',emptyKind:'You have not sent a message of this kind.',error:'Your messages could not be loaded. Please try again.',pending:'Awaiting a reply',reply:'Boşa Gezme! reply',yours:'Your message',feedback:'Thoughts and suggestions',correction:'Store information edit',addition:'Store addition'},
  de:{answered:'Beantwortet',empty:'Du hast uns noch keine Nachricht gesendet.',emptyKind:'Du hast keine Nachricht dieser Art gesendet.',error:'Deine Nachrichten konnten nicht geladen werden.',pending:'Wartet auf Antwort',reply:'Antwort von Boşa Gezme!',yours:'Deine Nachricht',feedback:'Meinung und Vorschlag',correction:'Geschäftsdaten bearbeiten',addition:'Geschäft hinzufügen'},
  ru:{answered:'Получен ответ',empty:'Вы ещё не отправляли нам сообщений.',emptyKind:'Сообщений этого типа вы не отправляли.',error:'Не удалось загрузить сообщения.',pending:'Ожидает ответа',reply:'Ответ Boşa Gezme!',yours:'Ваше сообщение',feedback:'Мнение и предложение',correction:'Изменение данных магазина',addition:'Добавление магазина'},
};

type Kind='feedback'|'correction'|'addition';

// What a message is, worked out from the line the form that sent it wrote at the top.
//
// The forms are ours and each writes a fixed first line, so this reads our own vocabulary
// rather than guessing at prose: the correction form writes its own prefix in the sender's
// language -- read from the form itself, all four -- and the add-a-store sheet writes one
// line beginning "Mağaza önerisi". Anything with no such line came from the open box in the
// footer.
//
// It is done here and not by a field on the message because there is no such field yet.
// The one the API carries, `kind`, is the topic somebody picked (suggestion, problem), and
// two different forms send the same value. If a source field is ever added, this function
// is the only thing that changes.
const ADDITION_PREFIX='Mağaza önerisi';

type Read={kind:Kind;body:string;store?:string;field?:number|string};

function classify(message:string):Read{
  const [first,...rest]=message.split('\n');
  const title=first.trim();
  const wording=Object.values(correctionWording).find(words=>title.startsWith(words.prefix));
  if(wording){
    // R65: the two lines the form writes under its title -- which shop, which kind of
    // information -- are taken out as the facts they are, and what follows the blank line is
    // the person's own words. A message from before the form wrote them keeps them in its
    // text. The kind of information is kept as its place in the form's list, so it can be
    // named in the reader's language rather than the one it was sent in.
    const lines=[...rest];
    let store:string|undefined;
    let field:number|string|undefined;
    while(lines.length&&lines[0].trim()){
      const line=lines[0].trim();
      if(line.startsWith(`${wording.store}:`))store=line.slice(wording.store.length+1).trim();
      else if(line.startsWith(`${wording.field}:`)){
        const value=line.slice(wording.field.length+1).trim();
        const index=wording.categories.indexOf(value);
        field=index>=0?index:value;
      }
      else break;
      lines.shift();
    }
    return {kind:'correction',store,field,body:lines.join('\n').trim()};
  }
  // The search that was running when somebody asked for a shop is deliberately not shown:
  // it is how the suggestion was made, not what was suggested.
  if(title.startsWith(ADDITION_PREFIX))return {kind:'addition',body:rest.join('\n').trim()};
  return {kind:'feedback',body:message};
}

const marks:Record<Kind,typeof MessageCircle>={feedback:MessageCircle,correction:SquarePen,addition:MapPinPlus};

export function ProfileMessages({locale}:{locale:Locale}){
  const [items,setItems]=useState<FeedbackMessage[]|null>(null);
  const [error,setError]=useState('');
  const [chosen,setChosen]=useState<Kind|null>(null);
  const text=copy[locale];
  useEffect(()=>{
    let active=true;
    void apiFetch('/api/proxy/me/messages?limit=50',{cache:'no-store'})
      .then(async response=>{if(!response.ok)throw new Error();return response.json() as Promise<{items:FeedbackMessage[]}>;})
      .then(result=>{if(active)setItems(result.items??[]);})
      .catch(()=>{if(active)setError(text.error);});
    return()=>{active=false;};
  },[text.error]);

  const sorted=useMemo(()=>(items??[]).map(item=>({item,...classify(item.message)})),[items]);

  if(error)return <p className="form-error" role="alert">{error}</p>;
  if(items===null)return <div className="profile-list-skeleton" aria-label={text.feedback}/>;
  if(items.length===0)return <p className="profile-empty">{text.empty}</p>;

  const kinds:[Kind,string][]=[['feedback',text.feedback],['correction',text.correction],['addition',text.addition]];
  // Until somebody picks, the page opens on the first kind that has anything in it. Opening
  // on an empty list beside two buttons carrying counts tells a reader their messages are
  // missing, when they are one button away.
  const showing=chosen??kinds.find(([kind])=>sorted.some(row=>row.kind===kind))?.[0]??'feedback';
  const shown=sorted.filter(row=>row.kind===showing);
  const date=(value:string)=>new Intl.DateTimeFormat(locale,{dateStyle:'medium'}).format(new Date(value));
  const time=(value:string)=>new Intl.DateTimeFormat(locale,{timeStyle:'short'}).format(new Date(value));

  // The favourites page's own two buttons, class for class, and a third: each names a kind
  // and opens the messages of that kind. Stacked rather than side by side, because these
  // three names are sentences where that page's two were words.
  return <>
    <div className="favorites-summary profile-message-filters" role="group" aria-label={text.feedback}>
      {kinds.map(([kind,label])=>{const Mark=marks[kind];return <button key={kind} type="button" className={showing===kind?'is-showing':undefined} aria-pressed={showing===kind} onClick={()=>setChosen(kind)}>
        <span className="favorites-summary-mark" aria-hidden="true"><Mark/></span>
        <span className="favorites-summary-copy"><span>{label}</span><strong>{sorted.filter(row=>row.kind===kind).length}</strong></span>
      </button>;})}
    </div>
    {shown.length===0
      ?<p className="profile-empty">{text.emptyKind}</p>
      :<div className="profile-messages">{shown.map(({item,kind,body,store,field})=>{const Mark=marks[kind];return <article key={item.id} className="profile-message">
        <header>
          <strong className="profile-message-kind"><Mark aria-hidden="true"/>{copy[locale][kind]}</strong>
          {/* The day and the hour, one under the other: a message sent this morning and one
              sent last night are a different thing to the person waiting on a reply. */}
          <time dateTime={item.created_at}>{date(item.created_at)}<small>{time(item.created_at)}</small></time>
        </header>
        {/* R65: which shop and which kind of information, as the two fixed facts they are --
            the same two labels on every card, so they are set as labels with the answer beside
            them rather than as two more lines of text. */}
        {kind==='correction'&&(store||field!==undefined)&&<dl className="profile-message-facts">
          {store&&<div><dt>{correctionWording[locale].store}</dt><dd>{store}</dd></div>}
          {field!==undefined&&<div><dt>{correctionWording[locale].field}</dt><dd>{typeof field==='number'?correctionWording[locale].categories[field]:field}</dd></div>}
        </dl>}
        {/* R59/R65: what somebody wrote in their own words, set apart as their words --
            labelled, and in the voice a reviewer's own note is set in -- so it does not read
            as one more line of the card's furniture. The add-a-store sheet sends a link
            rather than prose, and keeps the plain paragraph. */}
        {kind!=='addition'
          ?body&&<blockquote className="profile-message-quote"><p className="profile-message-said"><Quote aria-hidden="true"/>{text.yours}</p><p>{body}</p></blockquote>
          :<p>{body}</p>}
        {item.reply?<div className="profile-message-reply"><strong>{text.reply}</strong><p>{item.reply}</p>{item.replied_at&&<time dateTime={item.replied_at}>{date(item.replied_at)}<small>{time(item.replied_at)}</small></time>}</div>:<small className="profile-message-status">{text.pending}</small>}
      </article>;})}</div>}
  </>;
}
