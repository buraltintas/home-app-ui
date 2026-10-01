// A heading written as one string per language, with the phrase that carries the emphasis
// in brackets.
//
// It is one string rather than two because the emphasised phrase is not in the same place
// in every language -- it ends the Turkish sentence and opens the English one -- and a rule
// about position would have been right in one and wrong in the rest. Everything that needs
// the words without the decoration strips the brackets; only the heading that is looked at
// draws them.
//
// This lives here rather than beside one page because a second page wanted the same
// treatment, and the second copy of a rule is the one that drifts.
import Link from 'next/link';
import {Fragment,type ReactNode} from 'react';

// Two marks, both written into the string for the same reason: which word carries the
// emphasis, and which word is the one being offered, are facts about the sentence. Square
// brackets colour a phrase. Braces fill a word -- the heading's verb, drawn as the thing it
// stands for -- without making it a control. It is not one: the field below it is.
const MARKED=/\[([^\]]+)\]|\{([^}]+)\}/g;

export function plainTitle(title:string){return title.replace(/[[\]{}]/g,'').replace(/\n/g,' ');}

// A newline in the string is a line break in the heading. It is written into the string
// rather than produced by narrowing a column, because where a heading should break is a
// fact about the sentence and differs per language: Turkish wants "Sana uygun / Mağazaları
// / bul", and the same three lines forced on the English one would break it mid-phrase.
function lines(text:string){
  const parts=text.split('\n');
  return parts.map((part,index)=>index===0?part:<Fragment key={index}><br/>{part}</Fragment>);
}

// The same convention, one sentence lower: a word in brackets, and here it is the word that
// goes somewhere. Written into the string for the reason the emphasis is -- which word names
// the destination is a fact about the sentence, and it is not the same word, or in the same
// place, in four languages.
export function sentenceWithLink(text:string,href:string,className='inline-link'){
  const found=text.match(/\[([^\]]+)\]/);
  if(!found)return <>{lines(text)}</>;
  const [before,after]=text.split(found[0]);
  return <>{lines(before)}<Link href={href} className={className}>{found[1]}</Link>{lines(after)}</>;
}

// A filled verb written straight after the marked phrase stands under it as one object:
// the two share a column, so the fill is exactly as wide as the phrase above it and the
// verb sits in its middle (R69). That is a fact about the sentence -- the verb acts on
// those words -- so it follows from the string, in whichever language writes it that way,
// rather than from a width measured for one heading.
//
// `chipMark` is drawn before the verb inside its fill. The caller supplies it because what
// a verb is drawn as depends on what it does on that page.
export function emphasisedTitle(title:string,className='favorites-title-mark',chipMark?:ReactNode){
  const parts:ReactNode[]=[];
  let last=0;
  let key=0;
  let phrase:{node:ReactNode;end:number}|null=null;
  const flush=()=>{if(phrase){parts.push(phrase.node);phrase=null;}};
  for(const found of title.matchAll(MARKED)){
    const at=found.index??0;
    if(at>last){flush();parts.push(<Fragment key={key++}>{lines(title.slice(last,at))}</Fragment>);}
    if(found[1]!==undefined){
      flush();
      phrase={node:<span key={key++} className={className}>{lines(found[1])}</span>,end:at+found[0].length};
    }else{
      const chip=<span key={key++} className="title-chip">{chipMark}<span>{found[2]}</span></span>;
      if(phrase&&phrase.end===at){parts.push(<span key={key++} className="title-stack">{phrase.node}{chip}</span>);phrase=null;}
      else parts.push(chip);
    }
    last=at+found[0].length;
  }
  flush();
  if(last<title.length)parts.push(<Fragment key={key++}>{lines(title.slice(last))}</Fragment>);
  return <>{parts}</>;
}
